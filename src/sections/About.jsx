import { motion } from 'framer-motion';
import Section from '../components/Section';
import { ABOUT } from '../data/portfolio';

export default function About() {
  return (
    <Section id="about" label={ABOUT.eyebrow} heading={ABOUT.heading}>
      <div className="grid md:grid-cols-5 gap-10 md:gap-16">
        {/* Narrative */}
        <div className="md:col-span-3 space-y-6">
          {ABOUT.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-ink/85 leading-relaxed text-pretty"
            >
              {i === 0 ? (
                <>
                  <span className="font-display text-neon-cyan mr-2">01 /</span>
                  {p}
                </>
              ) : i === 1 ? (
                <>
                  <span className="font-display text-neon-violet mr-2">02 /</span>
                  {p}
                </>
              ) : (
                <>
                  <span className="font-display text-neon-pink mr-2">03 /</span>
                  {p}
                </>
              )}
            </motion.p>
          ))}
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 md:gap-4 content-start">
          {ABOUT.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative glass rounded-2xl p-5 border-glow overflow-hidden group min-w-0"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-neon-violet/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted mb-3">
                  {stat.label}
                </div>
                <div
                  className={`font-sans font-extrabold gradient-text leading-none mb-2 whitespace-nowrap ${
                    stat.value.length > 7
                      ? 'text-xl md:text-2xl'
                      : stat.value.length > 5
                      ? 'text-2xl md:text-3xl'
                      : 'text-3xl md:text-4xl'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="font-display text-[0.7rem] tracking-[0.05em] text-muted leading-snug">
                  {stat.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
