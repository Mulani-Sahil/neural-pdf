import os
import uuid
import tempfile
import asyncio
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from rag_pipeline import build_vectorstore, get_rag_chain

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Use temporary directory (Vercel writable location)
TEMP_DIR = tempfile.gettempdir()
UPLOAD_DIR = os.path.join(TEMP_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory session store (resets on cold start)
sessions = {}


class QuestionRequest(BaseModel):
    question: str
    session_id: str


def cleanup_session(session_id: str):
    """Clean up uploaded file and session memory"""
    if session_id not in sessions:
        return

    session_data = sessions.pop(session_id)

    # Remove uploaded file
    if 'file_path' in session_data and os.path.exists(session_data['file_path']):
        try:
            os.remove(session_data['file_path'])
        except Exception:
            pass


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    session_id = str(uuid.uuid4())

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    try:
        file_path = os.path.join(UPLOAD_DIR, f"{session_id}_{file.filename}")

        with open(file_path, "wb") as f:
            f.write(contents)

        # Build vectorstore (in-memory)
        vectorstore = build_vectorstore(file_path)
        rag_chain = get_rag_chain(vectorstore)

        sessions[session_id] = {
            "vectorstore": vectorstore,
            "rag_chain": rag_chain,
            "file_path": file_path,
            "pdf_name": file.filename,
        }

        return JSONResponse({
            "success": True,
            "message": "PDF indexed successfully",
            "filename": file.filename,
            "session_id": session_id
        })

    except Exception as e:
        cleanup_session(session_id)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/ask")
async def ask_question(payload: QuestionRequest):
    session_id = payload.session_id

    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if session_id not in sessions:
        raise HTTPException(status_code=400, detail="Please upload a PDF first.")

    rag_chain = sessions[session_id]["rag_chain"]

    async def stream():
        try:
            for chunk in rag_chain.stream({"input": payload.question}):
                if "answer" in chunk:
                    yield chunk["answer"]
                    await asyncio.sleep(0.01)
        except Exception as e:
            yield f"\n\nError: {str(e)}"

    return StreamingResponse(stream(), media_type="text/plain")


@app.get("/status/{session_id}")
async def get_status(session_id: str):
    if session_id in sessions:
        return JSONResponse({
            "pdf_loaded": True,
            "filename": sessions[session_id]["pdf_name"]
        })

    return JSONResponse({
        "pdf_loaded": False,
        "filename": None
    })


@app.delete("/cleanup/{session_id}")
async def cleanup_session_endpoint(session_id: str):
    cleanup_session(session_id)
    return JSONResponse({"success": True})


@app.get("/health")
async def health_check():
    return JSONResponse({"status": "healthy"})
