import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import Section from '../components/Section';
import { PROJECTS } from '../data/portfolio';

const accentMap = {
  cyan: {
    fg: '#5eead4',
    glow: 'rgba(94,234,212,0.35)',
    tag: 'rgba(94,234,212,0.1)',
    border: 'rgba(94,234,212,0.35)',
  },
  violet: {
    fg: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)',
    tag: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.35)',
  },
  pink: {
    fg: '#f0abfc',
    glow: 'rgba(240,171,252,0.35)',
    tag: 'rgba(240,171,252,0.1)',
    border: 'rgba(240,171,252,0.35)',
  },
};

function TiltCard({ project, index }) {
  const ref = useRef(null);
  const Icon = project.icon;
  const colors = accentMap[project.accent];

  // Primary target for the whole-card click: live demo if available, else github
  const primaryHref = project.live || project.github || null;
  const primaryLabel = project.live ? 'View live' : project.github ? 'View on GitHub' : null;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappier springs — faster recovery, no sluggish feel when clicking
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 22, mass: 0.4 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 22, mass: 0.4 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const stop = (e) => e.stopPropagation();

  const cardInner = (
    <>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${colors.glow}, transparent 40%)`,
        }}
      />

      <div className="relative p-7 md:p-9" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              background: colors.tag,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 0 20px -4px ${colors.glow}`,
            }}
          >
            <Icon size={24} style={{ color: colors.fg }} strokeWidth={1.75} />
          </div>

          <div className="flex items-center gap-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                onClick={stop}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/40 hover:bg-white/10 transition"
                aria-label={`${project.title} live demo`}
                title="Live demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                onClick={stop}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/40 hover:bg-white/10 transition"
                aria-label={`${project.title} on GitHub`}
                title="Source code"
              >
                <Github size={16} />
              </a>
            )}
          </div>
        </div>

        <div className="mb-5">
          <div
            className="font-display text-xs tracking-[0.22em] uppercase mb-3"
            style={{ color: colors.fg }}
          >
            {project.subtitle}
          </div>
          <h3 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight leading-[1.05]">
            {project.title}
          </h3>
        </div>

        <p className="text-base md:text-lg text-ink/75 leading-relaxed mb-5 text-pretty">
          {project.blurb}
        </p>

        {project.impact && (
          <div
            className="flex items-start gap-2.5 p-4 rounded-lg mb-6 text-[0.95rem]"
            style={{ background: colors.tag, border: `1px solid ${colors.border}` }}
          >
            <ArrowUpRight size={16} style={{ color: colors.fg }} className="mt-0.5 flex-shrink-0" />
            <span className="text-ink/90 leading-relaxed">{project.impact}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-display text-[0.7rem] tracking-[0.1em] uppercase px-3 py-1.5 rounded-md border border-white/10 text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        {primaryHref && (
          <div
            className="flex items-center gap-2 font-display text-[0.72rem] tracking-[0.15em] uppercase"
            style={{ color: colors.fg }}
          >
            <span>{primaryLabel}</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
            />
          </div>
        )}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[1px] opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.fg}, transparent)`,
        }}
      />
    </>
  );

  const sharedClass = `group relative glass rounded-2xl overflow-hidden block h-full ${
    primaryHref ? 'cursor-pointer' : ''
  }`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={project.highlight ? 'md:col-span-2' : ''}
    >
      {primaryHref ? (
        <a
          href={primaryHref}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${project.title} — ${primaryLabel}`}
          className={sharedClass}
        >
          {cardInner}
        </a>
      ) : (
        <article className={sharedClass}>{cardInner}</article>
      )}
    </motion.div>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      label="Selected work"
      heading="Engineering that ships."
      subheading="A portfolio of systems I designed, built, and deployed. Click any card to open the live build — corner icons link to source and details."
      className="perspective-1000"
    >
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {PROJECTS.map((p, i) => (
          <TiltCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
