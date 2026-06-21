import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touch);
    if (touch) return;

    const mouse = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x - 4}px, ${mouse.y - 4}px, 0)`;
      }
    };

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], [data-cursor="hover"]');
      setHovering(!!interactive);
    };

    let rafId;
    const animate = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 18}px, ${ring.y - 18}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none will-change-transform"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#5eead4',
          boxShadow: '0 0 12px #5eead4, 0 0 24px rgba(94,234,212,0.5)',
        }}
      />
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99998] pointer-events-none will-change-transform"
        animate={{
          scale: hovering ? 1.8 : 1,
          borderColor: hovering ? 'rgba(240,171,252,0.9)' : 'rgba(167,139,250,0.6)',
          backgroundColor: hovering ? 'rgba(240,171,252,0.1)' : 'rgba(167,139,250,0)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(167,139,250,0.6)',
        }}
      />
    </>
  );
}
