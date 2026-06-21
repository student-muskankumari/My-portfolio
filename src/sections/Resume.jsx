import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import Section from '../components/Section';
import { PROFILE } from '../data/portfolio';

const highlights = [
  {
    label: 'Education',
    value: 'B.Tech CSE · CGPA 8.38',
    sub: 'Computer Science & Communication Engineering',
  },
  {
    label: 'Focus',
    value: 'AI Agents · LLMs · Automation',
    sub: 'Python, n8n, LLMs, agentic workflows',
  },
  {
    label: 'Languages',
    value: 'English · Hindi',
    sub: 'Professional working proficiency',
  },
  {
    label: 'Location',
    value: 'Patna, Bihar',
    sub: 'Open to remote and relocation',
  },
];

export default function Resume() {
  return (
    <Section
      id="resume"
      label="Resume"
      heading="Resume, on paper."
      subheading="One page, recruiter- and ATS-friendly. Download below, or scan the highlights on the right."
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong rounded-3xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2">
          {/* Left — document preview */}
          <div className="relative p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-neon-violet/5 to-neon-cyan/5">
            <div className="absolute top-6 right-6 font-display text-[0.6rem] tracking-[0.22em] uppercase text-muted">
              Resume · v2026
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet p-[1px]">
                <div className="w-full h-full rounded-xl bg-bg flex items-center justify-center">
                  <FileText size={20} className="text-neon-cyan" />
                </div>
              </div>
              <div>
                <div className="font-sans font-bold text-lg">Muskan_Kumari_Resume.pdf</div>
                <div className="font-display text-xs text-muted">PDF · Single page</div>
              </div>
            </div>

            {/* Live PDF preview — renders the actual resume */}
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noreferrer noopener"
              className="relative block rounded-xl overflow-hidden border border-white/10 hover:border-neon-cyan/40 transition-colors group bg-white/[0.02]"
              aria-label="Open resume in new tab"
              title="Click to view full size"
            >
              <object
                data={`${PROFILE.resume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className="w-full h-[360px] pointer-events-none"
                aria-label="Resume preview"
              >
                {/* Fallback for browsers without inline PDF support */}
                <div className="flex items-center justify-center h-[360px] text-muted text-sm px-6 text-center">
                  Preview unavailable — click to open the PDF in a new tab.
                </div>
              </object>

              {/* Click-to-open overlay hint */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <span className="font-display text-[0.65rem] tracking-[0.2em] uppercase text-neon-cyan px-3 py-1.5 rounded-full bg-bg/80 border border-neon-cyan/40">
                  Click to open full size ↗
                </span>
              </div>
            </a>

            <a
              href={PROFILE.resume}
              download="Muskan_Kumari_Resume.pdf"
              className="btn-primary group mt-10"
            >
              <Download size={14} className="transition-transform group-hover:translate-y-0.5" />
              Download resume
            </a>
          </div>

          {/* Right — highlights */}
          <div className="p-8 md:p-12">
            <div className="space-y-6">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="pb-6 last:pb-0 border-b last:border-0 border-white/5"
                >
                  <div className="font-display text-[0.62rem] tracking-[0.2em] uppercase text-muted mb-1.5">
                    {h.label}
                  </div>
                  <div className="font-sans font-bold text-lg text-ink">{h.value}</div>
                  <div className="text-sm text-muted mt-1">{h.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
