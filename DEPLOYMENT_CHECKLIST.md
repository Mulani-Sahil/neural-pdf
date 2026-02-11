# ✅ Deployment Checklist for Render.com

## Pre-Deployment (5 minutes)

### 1. Get Google API Key
- [ ] Visit https://makersuite.google.com/app/apikey
- [ ] Create API key
- [ ] Copy and save the key securely

### 2. Prepare GitHub Repository
```bash
# Create new repository on GitHub
# Then run these commands:

git init
git add .
git commit -m "Initial commit - Neural PDF Intelligence"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Deployment (10 minutes)

### 3. Create Render Web Service
- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub account
- [ ] Select your repository

### 4. Configure Service
Copy these exact values:

**Name**: `neural-pdf-intelligence`

**Region**: `Oregon` (or closest to your location)

**Branch**: `main`

**Runtime**: `Python 3`

**Build Command**:
```
pip install --upgrade pip && pip install -r requirements.txt
```

**Start Command**:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type**: `Free`

### 5. Add Environment Variables
- [ ] Click "Advanced"
- [ ] Add Environment Variable:
  - **Key**: `GOOGLE_API_KEY`
  - **Value**: [Paste your API key here]

### 6. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 3-5 minutes for build to complete
- [ ] Watch logs for "Application startup complete"

## Post-Deployment (2 minutes)

### 7. Test Your App
- [ ] Click on your app URL (e.g., `https://neural-pdf-intelligence.onrender.com`)
- [ ] Upload a test PDF
- [ ] Ask a question
- [ ] Verify you get a response

### 8. Verify Health
- [ ] Visit: `https://your-app-url.onrender.com/health`
- [ ] Should show: `{"status": "healthy"}`

## Troubleshooting

If deployment fails:
1. Check Render logs for errors
2. Verify `GOOGLE_API_KEY` is set correctly
3. Ensure all files are in repository
4. Review `requirements.txt` for typos

## Quick Reference

### Your App URLs
- Main App: `https://[your-service-name].onrender.com`
- Health Check: `https://[your-service-name].onrender.com/health`

### Render Dashboard Links
- Logs: Dashboard → Your Service → Logs
- Settings: Dashboard → Your Service → Settings
- Environment: Dashboard → Your Service → Environment

### Redeploy
```bash
# Make changes
git add .
git commit -m "Update app"
git push origin main
# Render auto-deploys!
```

## Important Notes

⚠️ **Free Tier Limitations**:
- App sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 free hours per month

💡 **Tips**:
- Upgrade to Starter plan ($7/mo) to avoid sleep
- Use UptimeRobot to keep app awake on free tier
- Check logs regularly for errors

🎉 **Success!**
Your RAG application is now live and ready to use!

## Next Steps

1. Share your app URL with users
2. Monitor usage in Render dashboard
3. Consider upgrading for better performance
4. Add custom domain (paid plans)
5. Set up error tracking (Sentry)

---

**Need Help?**
- Read: `DEPLOYMENT_GUIDE.md` for detailed instructions
- Visit: https://docs.render.com/
- Community: https://community.render.com/
