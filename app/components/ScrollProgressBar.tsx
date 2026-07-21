/**
 * ScrollProgressBar — thin gradient bar at the top of the page
 * driven by Lenis scroll progress via a passive event listener.
 */
import { useEffect, useRef } from 'react';
import { getLenis } from '../lib/lenis';

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait one tick for Lenis to be initialized
    const timeout = setTimeout(() => {
      const lenis = getLenis();
      if (!lenis || !barRef.current) return;

      const bar = barRef.current;

      lenis.on('scroll', ({ progress }: { progress: number }) => {
        bar.style.transform = `scaleX(${progress})`;
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          width: '100%',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)',
          boxShadow: '0 0 8px rgba(59,130,246,0.6)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
