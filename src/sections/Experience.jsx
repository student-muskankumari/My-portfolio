import { motion } from 'framer-motion';
import Section from '../components/Section';
import { EXPERIENCE, CERTIFICATES } from '../data/portfolio';

export default function Experience() {
  return (
    <Section
      id="experience"
      label="Leadership & experience"
      heading="Showing up, shipping, leading."
      subheading="Roles that taught me to run teams, hit deadlines, and turn ambiguity into deliverables."
    >
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-neon-cyan/60 via-neon-violet/40 to-transparent" />

        <div className="space-y-10">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.role + i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-12 md:pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-8 top-3 -translate-x-1/2">
                <div className="relative w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-neon-cyan" />
                  <div className="absolute inset-0 rounded-full bg-neon-cyan animate-ping opacity-60" />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 md:p-7 border-glow">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-sans font-bold text-xl md:text-2xl">{exp.role}</h3>
                    <div className="font-body text-neon-violet text-sm mt-0.5">{exp.org}</div>
                  </div>
                  <span className="font-display text-[0.68rem] tracking-[0.2em] uppercase text-muted whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2 mt-4">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="flex gap-3 text-muted text-[0.95rem] leading-relaxed">
                      <span className="text-neon-cyan mt-1 flex-shrink-0">→</span>
                      <span className="text-pretty">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificates strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8 }}
        className="mt-20"
      >
        <div className="font-display text-[0.7rem] tracking-[0.22em] uppercase text-neon-cyan mb-6">
          — Certifications
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERTIFICATES.map((c) => (
            <div
              key={c.name}
              className="glass rounded-xl p-4 flex items-start gap-3 hover:border-neon-cyan/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-display text-[0.7rem] text-neon-violet">
                  {c.issuer.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-body text-sm text-ink/90 leading-snug">{c.name}</div>
                <div className="font-display text-[0.62rem] tracking-[0.15em] uppercase text-muted mt-1">
                  {c.issuer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
