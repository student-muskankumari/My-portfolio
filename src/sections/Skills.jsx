import { motion } from 'framer-motion';
import Section from '../components/Section';
import { SKILLS } from '../data/portfolio';

const accents = ['cyan', 'violet', 'pink', 'cyan'];
const accentColors = {
  cyan: { from: '#5eead4', to: '#60a5fa', glow: 'rgba(94,234,212,0.5)' },
  violet: { from: '#a78bfa', to: '#f0abfc', glow: 'rgba(167,139,250,0.5)' },
  pink: { from: '#f0abfc', to: '#fb7185', glow: 'rgba(240,171,252,0.5)' },
};

function SkillCard({ category, items, accent, index }) {
  const colors = accentColors[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-6 md:p-7 border-glow relative overflow-hidden"
    >
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ background: colors.from }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans font-bold text-xl">{category}</h3>
          <span
            className="font-display text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 rounded-full"
            style={{
              color: colors.from,
              border: `1px solid ${colors.from}40`,
              background: `${colors.from}10`,
            }}
          >
            {items.length} skills
          </span>
        </div>

        <div className="space-y-4">
          {items.map((s, i) => (
            <div key={s.name}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-body text-sm text-ink/90">{s.name}</span>
                <span className="font-display text-[0.7rem] text-muted">{s.level}</span>
              </div>
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                    boxShadow: `0 0 8px ${colors.glow}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <Section
      id="skills"
      label="Technical toolkit"
      heading="Skills calibrated to production."
      subheading="Not a laundry list — these are the tools I reach for when something needs to ship, scale, or survive a code review."
    >
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {SKILLS.map((s, i) => (
          <SkillCard key={s.category} {...s} accent={accents[i % accents.length]} index={i} />
        ))}
      </div>
    </Section>
  );
}
