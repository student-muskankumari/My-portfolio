import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/portfolio';

const HeroScene = lazy(() => import('../three/HeroScene'));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 px-5 md:px-8"
    >
      {/* 3D background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-50 z-0" />

      {/* Ambient glow auras */}
      <div className="glow-aura w-[500px] h-[500px] -left-40 top-20 bg-neon-violet/25" />
      <div className="glow-aura w-[400px] h-[400px] -right-20 bottom-10 bg-neon-cyan/20" />

      {/* Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent z-0" />

      {/* Content — split layout on large screens, stacked on mobile */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl w-full mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center"
      >
        {/* Left — text column */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <motion.div variants={item} className="flex justify-center lg:justify-start mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass font-display text-[0.7rem] tracking-[0.2em] uppercase text-neon-cyan">
              <Sparkles size={12} className="text-neon-pink" />
              <span>Open to 2026 opportunities</span>
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sans font-extrabold tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
          >
            <span className="block text-ink/80">Hello, I&apos;m</span>
            <span className="block gradient-text mt-1">{PROFILE.name}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted font-body leading-relaxed text-pretty"
          >
            <span className="font-display text-neon-cyan mr-1">{'>'}</span>
            {PROFILE.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
          >
            <a href="#projects" className="btn-primary group">
              View projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={PROFILE.resume}
              download="Muskan_Kumari_Resume.pdf"
              className="btn-ghost group"
            >
              <Download size={14} className="transition-transform group-hover:translate-y-0.5" />
              Download resume
            </a>
          </motion.div>

          {/* Stats — compact under buttons on desktop */}
          <motion.div
            variants={item}
            className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto lg:mx-0"
          >
            {[
              { v: '8.38', l: 'CGPA' },
              { v: 'AWS', l: 'Certified' },
              { v: '12+', l: 'projects' },
            ].map((s) => (
              <div key={s.l} className="text-center lg:text-left">
                <div className="font-sans font-extrabold text-3xl md:text-4xl gradient-text">
                  {s.v}
                </div>
                <div className="mt-1.5 font-display text-[0.65rem] tracking-[0.15em] uppercase text-muted">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — profile photo */}
        <motion.div
          variants={item}
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Outer animated ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, #5eead4, #60a5fa, #a78bfa, #f0abfc, #5eead4)',
                filter: 'blur(14px)',
                opacity: 0.35,
              }}
            />

            {/* Photo frame with gradient border */}
            <div
              className="relative w-64 h-80 md:w-80 md:h-96 rounded-[2rem] p-[2px] overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, #5eead4 0%, #a78bfa 50%, #f0abfc 100%)',
              }}
            >
              <div className="relative w-full h-full rounded-[calc(2rem-2px)] overflow-hidden bg-surface">
                <img
                  src="/images/profile.png"
                  alt="Muskan Kumari"
                  className="w-full h-full object-cover"
                />
                {/* Soft color overlay to tie the photo into the dark theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-neon-cyan/5 pointer-events-none" />
              </div>
            </div>

            {/* Floating badge — available for work */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-3 -left-3 md:-left-6 glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-glow-violet"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <div>
                <div className="font-display text-[0.62rem] tracking-[0.18em] uppercase text-muted">
                  Status
                </div>
                <div className="font-sans font-bold text-sm">Open to work</div>
              </div>
            </motion.div>

            {/* Floating corner accent */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute -top-3 -right-3 md:-right-6 glass-strong rounded-2xl px-4 py-3"
            >
              <div className="font-display text-[0.62rem] tracking-[0.18em] uppercase text-neon-cyan">
                SHIPPING
              </div>
              <div className="font-sans font-bold text-sm mt-0.5">AI · Agents · Automation</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-display text-[0.6rem] tracking-[0.3em] uppercase text-muted">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-neon-cyan to-transparent"
        />
      </motion.div>
    </section>
  );
}
