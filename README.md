# Neural PDF Intelligence - RAG Application

A powerful PDF question-answering system using Google Gemini AI, LangChain, and FastAPI. Upload a PDF and ask questions - the AI will provide answers based strictly on the document content.

## 🚀 Features

- **PDF Upload & Processing**: Upload PDFs up to 10MB
- **Semantic Search**: Uses vector embeddings for intelligent document retrieval
- **Streaming Responses**: Real-time AI responses with smooth streaming
- **Session Management**: Isolated user sessions with automatic cleanup
- **Beautiful UI**: Modern, dark-themed interface with animations

## 📋 Tech Stack

- **Backend**: FastAPI, Python 3.11
- **AI/ML**: Google Gemini AI, LangChain, ChromaDB
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Document Processing**: PyMuPDF

## 🌐 Deploy to Render.com

### Prerequisites

1. A [Render.com](https://render.com) account (free tier available)
2. A [Google AI Studio](https://makersuite.google.com/app/apikey) API key
3. Your code pushed to a GitHub repository

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
# Clone or create your repository
git init
git add .
git commit -m "Initial commit for Render deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

#### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `neural-pdf-intelligence` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Python 3`

   **Build Settings:**
   - **Build Command**: 
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

   **Plan:**
   - Select **Free** (or paid plan for better performance)

#### 3. Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `GOOGLE_API_KEY` | Your Google AI API key from [here](https://makersuite.google.com/app/apikey) |
| `PYTHON_VERSION` | `3.11.0` |

#### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your application
   - Deploy to a live URL

Your app will be available at: `https://your-service-name.onrender.com`

### Alternative: Deploy with render.yaml (Blueprint)

If you have `render.yaml` in your repository root:

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will auto-detect `render.yaml` and configure everything
5. Add your `GOOGLE_API_KEY` in the Environment Variables section
6. Click **"Apply"**

## 🔧 Local Development

### Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### Run Locally

```bash
# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit: `http://localhost:8000`

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini API Key | Yes | `AIzaSy...` |
| `PORT` | Server port (auto-set by Render) | No | `10000` |

## 🔒 Security Features

- **File Size Limits**: 10MB max PDF size
- **PDF-Only Uploads**: Rejects non-PDF files
- **Session Isolation**: Each user gets isolated session
- **Auto Cleanup**: Files and sessions auto-deleted
- **In-Memory Storage**: No persistent file storage

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serve main UI |
| `/upload` | POST | Upload and index PDF |
| `/ask` | POST | Ask question (streaming) |
| `/status/{session_id}` | GET | Check session status |
| `/cleanup/{session_id}` | DELETE | Cleanup session |
| `/health` | GET | Health check |

## 🐛 Troubleshooting

### Build Fails on Render

**Issue**: Dependencies fail to install

**Solution**: 
- Ensure `requirements.txt` has pinned versions
- Check Python version matches `runtime.txt`
- Review build logs for specific errors

### API Key Error

**Issue**: `GOOGLE_API_KEY not found`

**Solution**:
- Verify environment variable is set in Render dashboard
- Ensure key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Redeploy after adding environment variable

### Chromadb Installation Issues

**Issue**: ChromaDB fails to build

**Solution**:
- Render's Python 3.11 should handle this
- If issues persist, try Python 3.10 in `runtime.txt`

### Memory Issues (Free Tier)

**Issue**: App crashes with large PDFs

**Solution**:
- Reduce `chunk_size` in `rag_pipeline.py`
- Implement stricter file size limits
- Consider upgrading to paid Render plan

## 🎯 Performance Optimization

For production use:

1. **Upgrade Render Plan**: Free tier has limited resources
2. **Add Redis**: For session persistence across restarts
3. **Use PostgreSQL**: For vectorstore persistence (instead of in-memory ChromaDB)
4. **Enable Caching**: Cache frequently asked questions
5. **Add Rate Limiting**: Protect against abuse

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 💡 Tips

- **Free Tier Limits**: Render free tier sleeps after 15 min inactivity (30-60s wake time)
- **Persistent Storage**: Free tier has no persistent disk - use external DB for production
- **Logs**: Check Render logs tab for debugging
- **Custom Domain**: Available on paid plans

## 📞 Support

- Render Docs: https://docs.render.com/
- LangChain Docs: https://python.langchain.com/
- Google AI: https://ai.google.dev/

---

**Built with ❤️ using FastAPI, LangChain, and Google Gemini**
