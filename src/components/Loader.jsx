import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let id;
    const tick = () => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const inc = p < 70 ? 4 + Math.random() * 6 : 1 + Math.random() * 3;
        return Math.min(100, p + inc);
      });
    };
    id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-bg"
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-cyan-950/20" />

      <div className="relative flex flex-col items-center gap-10 max-w-sm px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-xs tracking-[0.3em] uppercase text-neon-cyan"
        >
          Initializing
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight">
            <span className="gradient-text">Muskan Kumari</span>
          </h1>
          <p className="mt-3 font-display text-[0.7rem] tracking-[0.18em] text-muted uppercase">
            Portfolio v2 · Booting system
          </p>
        </motion.div>

        <div className="w-full space-y-2">
          <div className="h-[1px] w-full bg-white/5 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.25 }}
              style={{ boxShadow: '0 0 10px rgba(167,139,250,0.8)' }}
            />
          </div>
          <div className="flex justify-between font-display text-[0.65rem] tracking-widest text-muted uppercase">
            <span>Loading assets</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
