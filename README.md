# Neural PDF — Vercel Deployment

An AI-powered PDF Q&A app built with Next.js + Groq LLaMA 3.3 70B.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Get a Free Groq API Key
- Go to [console.groq.com](https://console.groq.com)
- Sign up (free) → Create an API Key
- Copy the key

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/neural-pdf.git
git push -u origin main
```

### 3. Deploy on Vercel
- Go to [vercel.com](https://vercel.com) → New Project
- Import your GitHub repo
- In **Environment Variables**, add:
  - Name: `GROQ_API_KEY`
  - Value: your key from step 1
- Click **Deploy** ✅

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Create .env.local with your key
echo "GROQ_API_KEY=your_key_here" > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. User uploads a PDF → **`/api/upload`** extracts text using `pdf-parse`
2. Extracted text is stored in **React state** (browser memory — no server storage)
3. User asks a question → **`/api/ask`** sends text + question to **Groq API**
4. Groq's LLaMA 3.3 70B answers based only on the PDF content

### Why This Works on Vercel
- ✅ No file system writes (serverless-compatible)
- ✅ No in-memory sessions between requests
- ✅ PDF text lives in browser state
- ✅ Each API call is stateless

---

## Stack
- **Next.js 14** (App Router)
- **Groq SDK** (LLaMA 3.3 70B)
- **pdf-parse** (PDF text extraction)
- **TypeScript**
