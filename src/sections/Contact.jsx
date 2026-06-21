import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Send, Check, Copy } from 'lucide-react';
import Section from '../components/Section';
import { CONTACTS, PROFILE } from '../data/portfolio';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const canSubmit = name.trim() && email.trim() && message.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const mailSubject = subject.trim() || `Portfolio inquiry from ${name}`;
    const mailBody = [
      `Hi Muskan,`,
      ``,
      message.trim(),
      ``,
      `—`,
      `${name}`,
      `${email}`,
    ].join('\n');

    const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    window.location.href = mailto;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputBase =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-ink placeholder:text-muted/50 font-body text-[0.95rem] transition-colors focus:outline-none focus:border-neon-cyan/60 focus:bg-white/[0.05]';

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong rounded-3xl p-6 md:p-10 space-y-5"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight">
            Write me a message.
          </h3>
        </div>
        <CopyEmailButton />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-display text-[0.65rem] tracking-[0.18em] uppercase text-muted mb-2 block">
            Your name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
            className={inputBase}
          />
        </label>
        <label className="block">
          <span className="font-display text-[0.65rem] tracking-[0.18em] uppercase text-muted mb-2 block">
            Your email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputBase}
          />
        </label>
      </div>

      <label className="block">
        <span className="font-display text-[0.65rem] tracking-[0.18em] uppercase text-muted mb-2 block">
          Subject <span className="text-muted/60 normal-case tracking-normal">(optional)</span>
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Role at Company, project collab, speaking, …"
          className={inputBase}
        />
      </label>

      <label className="block">
        <span className="font-display text-[0.65rem] tracking-[0.18em] uppercase text-muted mb-2 block">
          Message
        </span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me what you're working on, what you need, and when you need it."
          rows={5}
          className={`${inputBase} resize-none`}
        />
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <p className="font-display text-[0.68rem] tracking-[0.14em] uppercase text-muted">
          Replies within 24h · Mon–Fri
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sent ? (
            <>
              <Check size={16} />
              Mail app opened
            </>
          ) : (
            <>
              <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
              Send message
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API unavailable — noop
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 hover:border-neon-cyan/50 hover:bg-white/[0.03] transition font-display text-[0.65rem] tracking-[0.18em] uppercase"
      title="Copy email to clipboard"
    >
      {copied ? (
        <>
          <Check size={12} className="text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy size={12} className="text-neon-cyan" />
          <span className="text-muted">{PROFILE.email}</span>
        </>
      )}
    </button>
  );
}

export default function Contact() {
  return (
    <Section
      id="contact"
      label="Let's talk"
      heading="Got a role, a project, or a good idea?"
      subheading="I reply within 24 hours on weekdays. Pick your channel — or send a message below."
    >
      {/* Channel grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
        {CONTACTS.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.a
              key={c.label}
              href={c.href}
              {...(c.download ? { download: true } : { target: '_blank', rel: 'noreferrer noopener' })}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative glass rounded-2xl p-6 md:p-7 border-glow overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/0 to-neon-cyan/0 group-hover:from-neon-violet/10 group-hover:to-neon-cyan/10 transition-all duration-500" />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors">
                    <Icon size={18} className="text-neon-cyan" />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-muted group-hover:text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>

                <div className="min-w-0">
                  <div className="font-display text-[0.62rem] tracking-[0.2em] uppercase text-muted mb-1.5">
                    {c.label}
                  </div>
                  <div className="font-sans font-bold text-base text-ink break-all group-hover:gradient-text transition-colors">
                    {c.value}
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Email form */}
      <ContactForm />

      {/* Footer line */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="font-display text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          © 2026 {PROFILE.name} · Built with React, Three.js, Framer Motion
        </div>
        <div className="font-display text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online · {PROFILE.location}
          </span>
        </div>
      </motion.div>
    </Section>
  );
}
