import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/portfolio';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 120) current = sec.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div
          className={`mx-auto max-w-6xl px-5 md:px-8 transition-all duration-300 ${
            scrolled ? 'glass rounded-full' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-pink p-[1px]">
                <div className="w-full h-full rounded-lg bg-bg flex items-center justify-center">
                  <span className="font-sans font-extrabold text-lg gradient-text">M</span>
                </div>
              </div>
              <span className="hidden sm:inline font-display text-xs tracking-[0.2em] uppercase text-muted group-hover:text-ink transition-colors">
                Muskan Kumari
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 font-display text-[0.72rem] tracking-[0.15em] uppercase transition-colors ${
                      isActive ? 'text-neon-cyan' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-[1px] bg-neon-cyan"
                        style={{ boxShadow: '0 0 6px #5eead4' }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-neon-cyan/60 transition-colors font-display text-[0.7rem] tracking-[0.15em] uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available
              </a>

              <button
                className="lg:hidden p-2 rounded-lg border border-white/10"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 glass-strong" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative pt-28 px-6 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="py-3 px-4 rounded-lg font-sans text-2xl font-bold hover:bg-white/5"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
