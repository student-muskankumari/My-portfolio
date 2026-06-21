/**
 * AskAIWidget.jsx
 *
 * Floating "Ask AI about my work" chat widget — mounted once in App.jsx,
 * outside <main>, so it persists across all scroll sections.
 *
 * Design: matches the site's dark theme exactly —
 *   • glass / glass-strong utility classes (globals.css)
 *   • neon cyan (#5eead4) + violet (#a78bfa) accent palette
 *   • Space Mono font for labels, Inter for messages
 *   • framer-motion for open/close + message pop-in
 *   • lucide-react icons (already in package.json)
 *   • No new npm dependencies added
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

// ─── Suggested starter questions ─────────────────────────────────────────────

const SUGGESTIONS = [
  'What is KronoX?',
  'Tell me about the Cuemath project',
  'What is Muskan\'s tech stack?',
  'What AI projects has she shipped?',
];

// ─── Single chat message bubble ──────────────────────────────────────────────

function Message({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-neon-violet/20 border border-neon-violet/30'
            : 'bg-neon-cyan/15 border border-neon-cyan/25'
        }`}
      >
        {isUser
          ? <User size={13} className="text-neon-violet" />
          : <Bot  size={13} className="text-neon-cyan"   />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[0.82rem] leading-relaxed ${
          isUser
            ? 'bg-neon-violet/15 border border-neon-violet/20 text-ink rounded-tr-sm'
            : 'bg-surface/80 border border-white/8 text-ink/90 rounded-tl-sm'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex gap-2.5 flex-row"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-neon-cyan/15 border border-neon-cyan/25">
        <Bot size={13} className="text-neon-cyan" />
      </div>
      <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-surface/80 border border-white/8">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neon-cyan/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────────────

export default function AskAIWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showSuggest, setShowSuggest] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  async function sendMessage(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setInput('');
    setShowSuggest(false);
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const answer = data.answer ?? data.error ?? 'Something went wrong — please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Network error — please check your connection and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleSuggestion(q) {
    sendMessage(q);
  }

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[9999] w-[340px] sm:w-[380px] flex flex-col"
            style={{
              maxHeight: 'min(520px, calc(100dvh - 120px))',
              borderRadius: '20px',
              background: 'rgba(7, 7, 17, 0.92)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              border: '1px solid rgba(167, 139, 250, 0.18)',
              boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(94,234,212,0.04)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(167,139,250,0.1)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(94,234,212,0.2), rgba(167,139,250,0.2))',
                    border: '1px solid rgba(94,234,212,0.25)',
                  }}
                >
                  <Bot size={15} className="text-neon-cyan" />
                </div>
                <div>
                  <p className="font-display text-[0.7rem] tracking-[0.15em] uppercase text-neon-cyan">
                    Ask AI
                  </p>
                  <p className="text-[0.68rem] text-muted leading-none mt-0.5">
                    About Muskan's work
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/30 hover:bg-white/8 transition-all"
                aria-label="Close chat"
              >
                <X size={14} className="text-muted" />
              </button>
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-neon-cyan/15 border border-neon-cyan/25">
                    <Bot size={13} className="text-neon-cyan" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-surface/80 border border-white/8 text-[0.82rem] leading-relaxed text-ink/90 max-w-[82%]">
                    Hey! I'm Muskan — ask me anything about my projects, skills, or experience. I'd love to tell you what I've built!
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}

              <AnimatePresence>
                {loading && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            <AnimatePresence>
              {showSuggest && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-3 flex flex-wrap gap-1.5"
                >
                  {SUGGESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSuggestion(q)}
                      className="text-[0.68rem] px-2.5 py-1 rounded-full border transition-all"
                      style={{
                        background: 'rgba(94,234,212,0.06)',
                        border: '1px solid rgba(94,234,212,0.2)',
                        color: '#5eead4',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(94,234,212,0.14)';
                        e.currentTarget.style.borderColor = 'rgba(94,234,212,0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(94,234,212,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(94,234,212,0.2)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input row */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(167,139,250,0.1)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills…"
                maxLength={500}
                disabled={loading}
                className="flex-1 bg-transparent text-[0.82rem] text-ink placeholder-muted/60 outline-none disabled:opacity-50"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #5eead4, #a78bfa)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                aria-label="Send message"
              >
                {loading
                  ? <Loader2 size={14} className="animate-spin text-muted" />
                  : <Send size={14} className={input.trim() ? 'text-bg' : 'text-muted'} />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ─────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? 'Close AI chat' : 'Ask AI about my work'}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        transition={{ delay: 3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: open
            ? 'rgba(13,13,26,0.95)'
            : 'linear-gradient(135deg, #5eead4 0%, #a78bfa 60%, #f0abfc 100%)',
          border: open
            ? '1px solid rgba(167,139,250,0.3)'
            : 'none',
          boxShadow: open
            ? '0 8px 32px -8px rgba(167,139,250,0.3)'
            : '0 8px 40px -8px rgba(94,234,212,0.5), 0 0 0 1px rgba(94,234,212,0.15)',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate: 90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} className="text-neon-violet" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={22} className="text-bg" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
