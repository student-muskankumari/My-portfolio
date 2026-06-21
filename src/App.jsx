import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Nav from './components/Nav';
import AskAIWidget from './components/AskAIWidget';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Resume from './sections/Resume';
import Contact from './sections/Contact';

export default function App() {
  const [loading, setLoading] = useState(true);
  useSmoothScroll();

  useEffect(() => {
    const done = () => setLoading(false);
    // Min loader time so it doesn't flash
    const t = setTimeout(done, 2200);

    if (document.readyState === 'complete') {
      setTimeout(done, 1400);
    } else {
      window.addEventListener('load', () => setTimeout(done, 800), { once: true });
    }
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">{loading && <Loader key="loader" />}</AnimatePresence>

      <CustomCursor />
      <Nav />
      <AskAIWidget />

      <main className="relative">
        {/* Ambient background decoration */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="glow-aura w-[600px] h-[600px] -left-60 top-1/3 bg-neon-violet/10" />
          <div className="glow-aura w-[500px] h-[500px] -right-40 top-2/3 bg-neon-cyan/10" />
        </div>

        <div className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Resume />
          <Contact />
        </div>
      </main>
    </>
  );
}
