# Project Structure

```
neural-pdf-intelligence/
│
├── main.py                 # FastAPI application entry point
├── rag_pipeline.py         # RAG pipeline logic (vector store, LLM chain)
├── requirements.txt        # Python dependencies
├── runtime.txt            # Python version for Render
├── render.yaml            # Render deployment configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore patterns
├── README.md              # Project documentation
├── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
│
└── templates/
    └── index.html         # Frontend UI (Jinja2 template)
```

## File Descriptions

### main.py
- FastAPI application with routes for PDF upload, question answering, and session management
- Handles file uploads to temporary directory
- Manages user sessions in memory
- Provides streaming responses for AI answers

### rag_pipeline.py
- Loads and processes PDFs using PyMuPDF
- Splits documents into chunks
- Creates vector embeddings using Google Gemini
- Sets up retrieval chain with LangChain
- Configures RAG prompt for PDF-only responses

### requirements.txt
- All Python dependencies with pinned versions
- Includes FastAPI, LangChain, ChromaDB, and Google Gemini integration

### runtime.txt
- Specifies Python 3.11.0 for Render deployment

### render.yaml
- Blueprint configuration for one-click Render deployment
- Defines build and start commands
- Lists environment variables needed

### templates/index.html
- Beautiful dark-themed UI with Tailwind CSS
- Handles PDF upload and question submission
- Displays streaming AI responses
- Session management on frontend

## Key Features

1. **Session Management**: Each user gets isolated session with UUID
2. **Streaming Responses**: Real-time AI answers using SSE
3. **Auto Cleanup**: Files and sessions automatically deleted
4. **Security**: File size limits, PDF-only uploads, no persistent storage
5. **Production Ready**: Configured for Render.com deployment

## Environment Variables

Required:
- `GOOGLE_API_KEY`: Your Google AI API key

Optional:
- `PORT`: Server port (auto-set by Render)

## Deployment Targets

- ✅ Render.com (Recommended)
- ✅ Railway
- ✅ Fly.io
- ✅ Any platform supporting Python/FastAPI

## Local Development

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your GOOGLE_API_KEY

# Run
uvicorn main:app --reload
```

## Production Considerations

1. **Free Tier**: Apps sleep after inactivity - expect 30-60s wake time
2. **Memory**: In-memory storage means data lost on restart
3. **Scaling**: For production, use PostgreSQL for vectors, Redis for sessions
4. **Monitoring**: Add error tracking (Sentry) and uptime monitoring

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Serve frontend UI |
| `/upload` | POST | Upload and index PDF |
| `/ask` | POST | Ask question (streaming) |
| `/status/{session_id}` | GET | Check session status |
| `/cleanup/{session_id}` | DELETE | Clean up session |
| `/health` | GET | Health check endpoint |
