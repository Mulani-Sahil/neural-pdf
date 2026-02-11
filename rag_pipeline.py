import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)

from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain


# --------------------------------------------------
# Load Environment Variables
# --------------------------------------------------
load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise EnvironmentError("❌ GOOGLE_API_KEY not found in .env file")


# --------------------------------------------------
# Build Vectorstore from PDF
# --------------------------------------------------
def build_vectorstore(pdf_path: str):
    """
    Load PDF → split → embed → store in Chroma
    """
    try:
        # Load PDF
        loader = PyMuPDFLoader(pdf_path)
        documents = loader.load()

        if not documents:
            raise ValueError("PDF is empty or unreadable")

        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        chunks = splitter.split_documents(documents)

        # Embeddings (Gemini)
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001"
        )

        # Vectorstore (persistent)
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory="./chroma_db"
        )

        print(f"✅ Indexed {len(chunks)} chunks from PDF")
        return vectorstore

    except Exception as e:
        raise Exception(f"Error building vectorstore: {str(e)}")


# --------------------------------------------------
# Create RAG Chain
# --------------------------------------------------
def get_rag_chain(vectorstore):
    """
    Create PDF-only RAG chain
    """
    try:
        # Retriever
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4}
        )

        # LLM (Stable Gemini)
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            temperature=0.3,
            streaming=True,
            max_retries=2
        )

        # STRICT PDF-ONLY Prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
You are a PDF document assistant.

CRITICAL RULES:
1. Use ONLY the information provided in the context
2. If the answer is not present, reply exactly:
   "I don't have this information in the provided PDF."
3. Do NOT use outside knowledge
4. Keep answers short (1–3 sentences max)

Context:
{context}
"""),
            ("human", "{input}")
        ])

        # Document chain
        document_chain = create_stuff_documents_chain(
            llm=llm,
            prompt=prompt
        )

        # Retrieval chain
        rag_chain = create_retrieval_chain(
            retriever=retriever,
            combine_docs_chain=document_chain
        )

        return rag_chain

    except Exception as e:
        raise Exception(f"Error creating RAG chain: {str(e)}")


# --------------------------------------------------
# Example Usage
# --------------------------------------------------
if __name__ == "__main__":
    pdf_path = "sample.pdf"  # <-- apna PDF path yaha do

    vectorstore = build_vectorstore(pdf_path)
    rag_chain = get_rag_chain(vectorstore)

    while True:
        query = input("\nAsk a question (or type 'exit'): ")
        if query.lower() == "exit":
            break

        response = rag_chain.invoke({"input": query})
        print("\nAnswer:", response["answer"])
