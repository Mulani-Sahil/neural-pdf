# 🚀 Render.com Deployment Guide

## Quick Start (5 Minutes)

### Step 1: Get Google API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Get API Key"** → **"Create API Key"**
3. Copy the key (starts with `AIza...`)

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for Render deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Sign up/Login** to [Render](https://dashboard.render.com/)

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Click **"Connect Account"** if GitHub not connected
   - Select your repository

3. **Configure Service**
   ```
   Name: neural-pdf-intelligence
   Region: Oregon (or closest to you)
   Branch: main
   Runtime: Python 3
   
   Build Command:
   pip install --upgrade pip && pip install -r requirements.txt
   
   Start Command:
   uvicorn main:app --host 0.0.0.0 --port $PORT
   
   Plan: Free
   ```

4. **Add Environment Variable**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `GOOGLE_API_KEY`
   - Value: [paste your API key]

5. **Click "Create Web Service"**

6. **Wait for Deployment** (3-5 minutes)
   - Watch the logs in real-time
   - Once you see "Application startup complete", you're live!

7. **Access Your App**
   - URL will be: `https://your-service-name.onrender.com`

#### Option B: Using render.yaml (Blueprint)

If your repository has `render.yaml`:

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render auto-detects configuration
5. Add `GOOGLE_API_KEY` in Environment section
6. Click **"Apply"**

---

## Detailed Configuration

### Build Command Explained
```bash
pip install --upgrade pip && pip install -r requirements.txt
```
- Upgrades pip to latest version
- Installs all dependencies from requirements.txt

### Start Command Explained
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
- `uvicorn`: ASGI server for FastAPI
- `main:app`: Runs the FastAPI app from main.py
- `--host 0.0.0.0`: Accepts connections from any IP
- `--port $PORT`: Uses Render's assigned port

### Required Environment Variables

| Variable | Where to Get | Example |
|----------|--------------|---------|
| `GOOGLE_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) | `AIzaSyC...` |

---

## Post-Deployment Checklist

- [ ] App is accessible at the Render URL
- [ ] Health check endpoint works: `/health`
- [ ] Can upload a PDF successfully
- [ ] Can ask questions and get responses
- [ ] No errors in Render logs

---

## Testing Your Deployment

1. **Visit your app URL**
2. **Test PDF Upload**:
   - Create a simple test PDF
   - Upload it through the interface
   - Check for "SCAN COMPLETE" message
3. **Test Question Asking**:
   - Type a question about the PDF content
   - Click "PROCESS QUERY"
   - Verify you get a streaming response
4. **Check Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for any errors

---

## Common Issues & Solutions

### ❌ Build Failed

**Symptoms**: Deployment fails during build

**Solutions**:
```bash
# Check requirements.txt has no syntax errors
# Ensure Python version matches runtime.txt
# Review build logs for specific error
```

### ❌ API Key Error

**Symptoms**: `GOOGLE_API_KEY not found in .env file`

**Solutions**:
1. Double-check environment variable name is exactly `GOOGLE_API_KEY`
2. Ensure no extra spaces in the value
3. After adding env var, trigger manual deploy

### ❌ App Won't Start

**Symptoms**: Build succeeds but app doesn't respond

**Solutions**:
1. Check start command is correct
2. Verify `main.py` and `rag_pipeline.py` are in repository root
3. Ensure `templates/` directory exists with `index.html`

### ❌ ChromaDB Installation Error

**Symptoms**: `ERROR: Failed building wheel for chromadb`

**Solutions**:
- Python 3.11 should work fine
- If issues persist, try Python 3.10 in `runtime.txt`
- Check Render build logs for specific error

### ❌ File Upload Not Working

**Symptoms**: "Failed to process PDF"

**Solutions**:
1. Check PDF is valid and under 10MB
2. Review application logs for specific error
3. Ensure temp directory is writable (handled automatically)

### ❌ Slow Response on First Request

**Symptoms**: First request takes 30-60 seconds

**This is normal!** Free tier apps sleep after 15 minutes of inactivity.

**Solutions**:
- Upgrade to paid plan (no sleep)
- Use UptimeRobot to ping every 14 minutes
- Inform users of potential initial delay

---

## Monitoring Your App

### View Logs
```
Dashboard → Your Service → Logs
```

### Metrics (Paid Plans)
```
Dashboard → Your Service → Metrics
```

### Health Check
```
https://your-app.onrender.com/health
```

---

## Upgrading & Optimization

### Upgrade to Paid Plan

**Benefits**:
- No sleep/shutdown
- More memory and CPU
- Faster cold starts
- Better reliability

**Cost**: Starting at $7/month

### Performance Tips

1. **Add Persistent Database**
   - Use PostgreSQL for vector storage
   - Store session data in Redis

2. **Enable Caching**
   - Cache common queries
   - Store embeddings persistently

3. **Optimize Chunking**
   ```python
   # In rag_pipeline.py
   splitter = RecursiveCharacterTextSplitter(
       chunk_size=800,  # Reduce for faster processing
       chunk_overlap=50
   )
   ```

4. **Add Rate Limiting**
   ```bash
   pip install slowapi
   ```

---

## Updating Your App

### Push Changes
```bash
git add .
git commit -m "Update description"
git push origin main
```

Render auto-deploys on every push to `main` branch!

### Manual Deploy
```
Dashboard → Your Service → Manual Deploy → Deploy Latest Commit
```

---

## Custom Domain (Paid Plans)

1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## Backup & Rollback

### Rollback to Previous Version
```
Dashboard → Your Service → Events → Find successful deploy → Redeploy
```

### Download Logs
```
Dashboard → Your Service → Logs → Download
```

---

## Cost Estimation

### Free Tier
- **Cost**: $0/month
- **Limits**: 
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - Shared CPU/RAM

### Starter Plan
- **Cost**: $7/month
- **Benefits**:
  - No sleep
  - 512MB RAM
  - Better performance

---

## Next Steps

1. ✅ **Add monitoring**: Set up UptimeRobot
2. ✅ **Custom domain**: Add your domain (paid plan)
3. ✅ **Analytics**: Add Google Analytics
4. ✅ **Error tracking**: Integrate Sentry
5. ✅ **Optimize**: Profile and improve performance

---

## Support Resources

- **Render Docs**: https://docs.render.com/
- **Render Community**: https://community.render.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **LangChain Docs**: https://python.langchain.com/

---

## Troubleshooting Checklist

Before asking for help:

- [ ] Checked Render logs for errors
- [ ] Verified environment variables are set correctly
- [ ] Confirmed GitHub repository is up to date
- [ ] Tested locally with same environment
- [ ] Reviewed recent changes that might cause issues
- [ ] Checked Render status page for outages

---

**🎉 Congratulations! Your RAG app is now live on Render!**

Share your app URL and start using your AI-powered PDF assistant.
