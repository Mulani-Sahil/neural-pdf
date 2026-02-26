/*
Project Name: Neural PDF AI
Developer: Sahil Mulani
Developed: 2026
*/
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────
   INTRO ANIMATION
───────────────────────────────────────────── */
function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'lines' | 'text' | 'tagline' | 'out'>('idle');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('lines'),   100);
    const t2 = setTimeout(() => setPhase('text'),    700);
    const t3 = setTimeout(() => setPhase('tagline'), 1500);
    const t4 = setTimeout(() => setPhase('out'),     2800);
    const t5 = setTimeout(() => onComplete(),        3600);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .intro-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #080808;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
          font-family: 'Syne', sans-serif;
        }
        .intro-root.phase-out { opacity: 0; transform: scale(1.04); pointer-events: none; }
        .intro-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,106,247,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,106,247,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0; transition: opacity 0.8s ease;
        }
        .intro-root.phase-lines .intro-grid,
        .intro-root.phase-text .intro-grid,
        .intro-root.phase-tagline .intro-grid { opacity: 1; }
        .intro-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,106,247,0.18) 0%, transparent 70%);
          opacity: 0; transition: opacity 1s ease;
        }
        .intro-root.phase-text .intro-glow, .intro-root.phase-tagline .intro-glow { opacity: 1; }
        .intro-scanlines {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
        }
        .intro-corner { position: absolute; width: 24px; height: 24px; opacity: 0; transition: opacity 0.5s ease; }
        .intro-corner-tl { top: 32px; left: 32px; border-top: 1.5px solid rgba(124,106,247,0.6); border-left: 1.5px solid rgba(124,106,247,0.6); }
        .intro-corner-tr { top: 32px; right: 32px; border-top: 1.5px solid rgba(124,106,247,0.6); border-right: 1.5px solid rgba(124,106,247,0.6); }
        .intro-corner-bl { bottom: 32px; left: 32px; border-bottom: 1.5px solid rgba(124,106,247,0.6); border-left: 1.5px solid rgba(124,106,247,0.6); }
        .intro-corner-br { bottom: 32px; right: 32px; border-bottom: 1.5px solid rgba(124,106,247,0.6); border-right: 1.5px solid rgba(124,106,247,0.6); }
        .intro-root.phase-lines .intro-corner,
        .intro-root.phase-text .intro-corner,
        .intro-root.phase-tagline .intro-corner { opacity: 1; }
        .intro-sweep {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,106,247,0.5), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .intro-sweep-1 { top: 33%; transition-delay: 0.05s; }
        .intro-sweep-2 { bottom: 33%; transition-delay: 0.15s; }
        .intro-root.phase-lines .intro-sweep,
        .intro-root.phase-text .intro-sweep,
        .intro-root.phase-tagline .intro-sweep { transform: scaleX(1); }
        .intro-center { position: relative; z-index: 2; text-align: center; }
        .intro-icon {
          width: 64px; height: 64px; margin: 0 auto 28px;
          background: linear-gradient(135deg, #7c6af7, #5b8af7);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center; font-size: 28px;
          box-shadow: 0 0 40px rgba(124,106,247,0.4), 0 0 80px rgba(124,106,247,0.15);
          opacity: 0; transform: scale(0.7) translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .intro-root.phase-text .intro-icon,
        .intro-root.phase-tagline .intro-icon { opacity: 1; transform: scale(1) translateY(0); }
        .intro-title {
          font-size: clamp(36px, 6vw, 72px); font-weight: 800;
          letter-spacing: -2px; line-height: 1;
          color: transparent;
          background: linear-gradient(135deg, #fff 30%, rgba(124,106,247,0.9) 100%);
          -webkit-background-clip: text; background-clip: text;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s;
          margin-bottom: 6px;
        }
        .intro-root.phase-text .intro-title, .intro-root.phase-tagline .intro-title { opacity: 1; transform: translateY(0); }
        .intro-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(124,106,247,0.7);
          opacity: 0; transition: opacity 0.5s ease 0.25s; margin-bottom: 28px;
        }
        .intro-root.phase-text .intro-label, .intro-root.phase-tagline .intro-label { opacity: 1; }
        .intro-divider {
          width: 0; height: 1px; margin: 0 auto 24px;
          background: linear-gradient(90deg, transparent, rgba(124,106,247,0.5), transparent);
          transition: width 0.5s ease 0.35s;
        }
        .intro-root.phase-tagline .intro-divider { width: 200px; }
        .intro-tagline {
          font-size: 15px; font-weight: 400; color: rgba(255,255,255,0.45);
          letter-spacing: 0.02em; line-height: 1.6;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s;
          max-width: 340px; margin: 0 auto;
        }
        .intro-root.phase-tagline .intro-tagline { opacity: 1; transform: translateY(0); }
        .intro-bar-wrap {
          margin-top: 48px; width: 200px; margin-left: auto; margin-right: auto;
          height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden;
          opacity: 0; transition: opacity 0.3s ease 0.6s;
        }
        .intro-root.phase-tagline .intro-bar-wrap { opacity: 1; }
        .intro-bar {
          height: 100%; background: linear-gradient(90deg, #7c6af7, #5b8af7);
          border-radius: 2px; animation: introBarFill 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
          animation-delay: 0.8s; width: 0%;
        }
        @keyframes introBarFill { from { width: 0%; } to { width: 100%; } }
        .intro-particle {
          position: absolute; width: 2px; height: 2px;
          background: rgba(124,106,247,0.6); border-radius: 50%;
          animation: introFloatUp linear infinite; opacity: 0;
        }
        @keyframes introFloatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; } 90% { opacity: 0.4; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
      `}</style>

      <div className={`intro-root phase-${phase}`}>
        <div className="intro-grid" />
        <div className="intro-glow" />
        <div className="intro-scanlines" />
        <div className="intro-corner intro-corner-tl" />
        <div className="intro-corner intro-corner-tr" />
        <div className="intro-corner intro-corner-bl" />
        <div className="intro-corner intro-corner-br" />
        <div className="intro-sweep intro-sweep-1" />
        <div className="intro-sweep intro-sweep-2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="intro-particle" style={{
            left: `${10 + (i * 7.5) % 80}%`,
            bottom: `${20 + (i * 13) % 40}%`,
            animationDuration: `${2.5 + (i * 0.4) % 2}s`,
            animationDelay: `${0.8 + (i * 0.15) % 1.5}s`,
          }} />
        ))}
        <div className="intro-center">
          <div className="intro-icon">⚡</div>
          <h1 className="intro-title">Neural PDF</h1>
          <div className="intro-label">AI · Document Intelligence</div>
          <div className="intro-divider" />
          <p className="intro-tagline">
            Upload any PDF. Ask anything.<br />Powered by LLaMA 3.3 · 70B.
          </p>
          <div className="intro-bar-wrap">
            <div className="intro-bar" />
          </div>
        </div>
      </div>
    </>
  );
}


/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I am Neural PDF. Upload a PDF and ask me anything about it — or just chat with me directly!',
      timestamp: new Date(),
    }
  ]);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(), role, content, timestamp: new Date(),
    }]);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      addMessage('assistant', 'Only PDF files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addMessage('assistant', 'File too large. Maximum size is 10MB.');
      return;
    }
    setUploading(true);
    addMessage('user', 'Uploaded: ' + file.name);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPdfText(data.pdfText);
      setFilename(data.filename);
      addMessage('assistant', 'Got it! I have loaded ' + data.filename + ' (' + data.pageCount + ' pages). Ask me anything about it or anything else!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      addMessage('assistant', 'Failed to load PDF: ' + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    addMessage('user', q);
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, pdfText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addMessage('assistant', data.answer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      addMessage('assistant', 'Error: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const renderContent = (text: string) =>
    text.split('\n')
      .map(line =>
        line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
      )
      .join('<br/>');

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0d0d0d; --sidebar: #111111; --surface: #1a1a1a; --surface2: #222222;
          --border: rgba(255,255,255,0.07); --text: #e8e8e8; --text-muted: #666;
          --text-dim: #444; --accent: #7c6af7; --accent2: #5b8af7;
          --font: 'DM Sans', sans-serif; --mono: 'DM Mono', monospace;
        }
        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); }
        .layout { display: flex; height: 100vh; overflow: hidden; }
        .sidebar {
          width: 260px; background: var(--sidebar); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; padding: 20px 16px; flex-shrink: 0;
        }
        .logo { display: flex; align-items: center; gap: 10px; padding: 8px 4px; margin-bottom: 28px; }
        .logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .logo-text { font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }
        .new-chat-btn {
          display: flex; align-items: center; gap: 8px; padding: 10px 14px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
          color: var(--text); font-family: var(--font); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s; width: 100%; margin-bottom: 20px;
        }
        .new-chat-btn:hover { background: var(--surface2); }
        .sidebar-label { font-size: 10px; font-weight: 600; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 4px; margin-bottom: 8px; }
        .pdf-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
        .pdf-name { color: var(--accent); font-weight: 500; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .pdf-status { color: var(--text-muted); font-size: 11px; }
        .upload-sidebar-btn {
          margin-top: 12px; display: flex; align-items: center; gap: 8px; padding: 10px 14px;
          background: transparent; border: 1px dashed rgba(124,106,247,0.3); border-radius: 10px;
          color: var(--accent); font-family: var(--font); font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; width: 100%;
        }
        .upload-sidebar-btn:hover { background: rgba(124,106,247,0.08); border-color: rgba(124,106,247,0.5); }
        .sidebar-footer { margin-top: auto; font-size: 11px; color: var(--text-dim); padding: 0 4px; line-height: 1.6; }
        .chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .topbar { height: 56px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 12px; flex-shrink: 0; background: var(--bg); }
        .topbar-title { font-size: 14px; font-weight: 500; }
        .topbar-badge { font-size: 10px; background: rgba(124,106,247,0.15); color: var(--accent); border: 1px solid rgba(124,106,247,0.25); border-radius: 20px; padding: 2px 10px; font-family: var(--mono); }
        .messages { flex: 1; overflow-y: auto; padding: 32px 0 16px; }
        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 4px; }
        .msg-row { display: flex; padding: 4px 24px; margin-bottom: 2px; gap: 12px; max-width: 820px; margin-left: auto; margin-right: auto; width: 100%; }
        .avatar { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-top: 2px; }
        .avatar-ai { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
        .avatar-user { background: var(--surface2); border: 1px solid var(--border); }
        .msg-content { flex: 1; min-width: 0; }
        .msg-name { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
        .msg-time { font-size: 10px; color: var(--text-dim); font-family: var(--mono); }
        .msg-bubble { font-size: 14px; line-height: 1.75; color: var(--text); padding: 12px 16px; border-radius: 12px; display: inline-block; max-width: 100%; word-break: break-word; }
        .msg-bubble.ai { background: #161616; border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; }
        .msg-bubble.user { background: #1e1e2e; border: 1px solid rgba(124,106,247,0.15); border-radius: 12px 4px 12px 12px; }
        .msg-bubble code { font-family: var(--mono); font-size: 12px; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px; color: #a78bfa; }
        .typing-row { display: flex; padding: 4px 24px; gap: 12px; max-width: 820px; margin: 0 auto; width: 100%; }
        .typing-dots { display: flex; align-items: center; gap: 4px; padding: 14px 16px; background: #161616; border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; }
        .typing-dots span { width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: bounce 1.2s ease-in-out infinite; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }
        .drop-overlay { position: absolute; inset: 0; background: rgba(124,106,247,0.08); border: 2px dashed rgba(124,106,247,0.4); display: flex; align-items: center; justify-content: center; z-index: 50; pointer-events: none; }
        .drop-text { font-size: 18px; font-weight: 600; color: var(--accent); text-align: center; }
        .input-area { padding: 16px 24px 24px; background: var(--bg); flex-shrink: 0; }
        .input-box { max-width: 820px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; align-items: flex-end; gap: 8px; padding: 10px 10px 10px 16px; transition: border-color 0.2s; }
        .input-box:focus-within { border-color: rgba(124,106,247,0.4); box-shadow: 0 0 0 3px rgba(124,106,247,0.07); }
        .input-box textarea { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font); font-size: 14px; line-height: 1.6; resize: none; min-height: 24px; max-height: 160px; overflow-y: auto; }
        .input-box textarea::placeholder { color: var(--text-dim); }
        .attach-btn { width: 34px; height: 34px; background: transparent; border: none; border-radius: 8px; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
        .attach-btn:hover { background: var(--surface2); color: var(--text); }
        .send-btn { width: 34px; height: 34px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border: none; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
        .send-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
        .input-hint { text-align: center; font-size: 11px; color: var(--text-dim); margin-top: 8px; max-width: 820px; margin-left: auto; margin-right: auto; }
        @media (max-width: 640px) { .sidebar { display: none; } .msg-row, .typing-row { padding: 4px 12px; } .input-area { padding: 12px 12px 20px; } }

        /* Main app fade-in after intro */
        .main-app {
          opacity: 0; transition: opacity 0.5s ease 0.15s;
        }
        .main-app.visible { opacity: 1; }
      `}</style>

      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }}
      />

      <div className={`main-app ${!showIntro ? 'visible' : ''}`} style={{ height: '100vh' }}>
        <div className="layout">
          <aside className="sidebar">
            <div className="logo">
              <div className="logo-icon">⚡</div>
              <span className="logo-text">Neural PDF</span>
            </div>
            <button className="new-chat-btn" onClick={() => {
              setMessages([{ id: '0', role: 'assistant', content: 'New chat started! Upload a PDF or ask me anything.', timestamp: new Date() }]);
              setPdfText(null); setFilename(null);
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Chat
            </button>
            <div className="sidebar-label">Document</div>
            {filename ? (
              <div className="pdf-card">
                <div className="pdf-name">📄 {filename}</div>
                <div className="pdf-status">✅ Ready to query</div>
              </div>
            ) : (
              <div className="pdf-card">
                <div className="pdf-status" style={{ color: 'var(--text-dim)' }}>No PDF loaded</div>
              </div>
            )}
            <button className="upload-sidebar-btn" onClick={() => fileInputRef.current?.click()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              {filename ? 'Replace PDF' : 'Upload PDF'}
            </button>
            <div className="sidebar-footer">
              Powered by Groq LLaMA 3.3 70B<br/>
              Enter to send · Shift+Enter new line
            </div>
          </aside>

          <main
            className="chat-area"
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {dragOver && (
              <div className="drop-overlay">
                <div className="drop-text">📄<br/>Drop PDF here</div>
              </div>
            )}
            <div className="topbar">
              <span className="topbar-title">Chat</span>
              {filename && <span className="topbar-badge">📄 {filename}</span>}
            </div>
            <div className="messages">
              {messages.map(msg => (
                <div className="msg-row" key={msg.id}>
                  <div className={`avatar ${msg.role === 'assistant' ? 'avatar-ai' : 'avatar-user'}`}>
                    {msg.role === 'assistant' ? '⚡' : '👤'}
                  </div>
                  <div className="msg-content">
                    <div className="msg-name">
                      {msg.role === 'assistant' ? 'Neural PDF' : 'You'}
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div
                      className={`msg-bubble ${msg.role === 'assistant' ? 'ai' : 'user'}`}
                      dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                    />
                  </div>
                </div>
              ))}
              {(loading || uploading) && (
                <div className="typing-row">
                  <div className="avatar avatar-ai">⚡</div>
                  <div className="msg-content">
                    <div className="msg-name">Neural PDF</div>
                    <div className="typing-dots"><span/><span/><span/></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="input-area">
              <div className="input-box">
                <button className="attach-btn" title="Upload PDF" onClick={() => fileInputRef.current?.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
              <div className="input-hint">Enter to send · Shift+Enter for new line · 📎 to attach PDF</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
