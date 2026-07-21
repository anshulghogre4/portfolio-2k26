/**
 * RoboticEye — A CSS/SVG cursor-tracking mechanical eye for the About section.
 * Uses Motion's useMotionValue + useSpring for smooth iris tracking.
 * Styled to match the portfolio's blue-purple accent palette.
 */
import { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { prefersReducedMotion } from '../lib/motionPrefs';

// How far the iris can move from center (in px, relative to eye radius)
const IRIS_TRAVEL = 18;

export function RoboticEye() {
  const eyeRef = useRef<HTMLDivElement>(null);

  // Raw mouse-relative position (-1 to 1 in each axis)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed iris movement
  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };
  const irisX = useSpring(rawX, springConfig);
  const irisY = useSpring(rawY, springConfig);

  // Transform normalized -1..1 to pixel offset
  const translateX = useTransform(irisX, [-1, 1], [-IRIS_TRAVEL, IRIS_TRAVEL]);
  const translateY = useTransform(irisY, [-1, 1], [-IRIS_TRAVEL, IRIS_TRAVEL]);

  // Outer ring slow rotation
  const ringRotation = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Normalize to -1..1 based on distance from eye center
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);

      rawX.set(Math.max(-1, Math.min(1, dx)));
      rawY.set(Math.max(-1, Math.min(1, dy)));
    };

    window.addEventListener('mousemove', onMouseMove);

    // Slowly rotate outer rings
    let frame = 0;
    let raf: number;
    const animateRing = () => {
      frame += 0.003;
      ringRotation.set(frame * (180 / Math.PI)); // radians → degrees
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [rawX, rawY, ringRotation]);

  return (
    <div
      ref={eyeRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        flexShrink: 0,
      }}
    >
      {/* ── Outer ambient glow ─────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: '-24px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)',
        filter: 'blur(16px)',
        pointerEvents: 'none',
      }} />

      {/* ── Rotating outer circuit ring ────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          rotate: ringRotation,
        }}
      >
        <svg viewBox="0 0 240 240" style={{ width: '100%', height: '100%' }}>
          <circle cx="120" cy="120" r="114"
            fill="none"
            stroke="rgba(59,130,246,0.25)"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
          {/* Circuit tick marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const r1 = 108, r2 = i % 6 === 0 ? 98 : 104;
            return (
              <line
                key={i}
                x1={120 + Math.cos(angle) * r1}
                y1={120 + Math.sin(angle) * r1}
                x2={120 + Math.cos(angle) * r2}
                y2={120 + Math.sin(angle) * r2}
                stroke={i % 6 === 0 ? 'rgba(168,85,247,0.6)' : 'rgba(59,130,246,0.3)'}
                strokeWidth={i % 6 === 0 ? 2 : 1}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* ── Counter-rotating inner ring ────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '16px',
          borderRadius: '50%',
          rotate: useTransform(ringRotation, (v: number) => -v * 0.6),
        }}
      >
        <svg viewBox="0 0 208 208" style={{ width: '100%', height: '100%' }}>
          <circle cx="104" cy="104" r="99"
            fill="none"
            stroke="rgba(168,85,247,0.2)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>
      </motion.div>

      {/* ── Sclera (white of eye) ──────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: '28px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 45% 40%, #1a1f2e 0%, #0d0f1a 60%, #080a12 100%)',
        border: '1px solid rgba(59,130,246,0.35)',
        boxShadow: `
          inset 0 0 30px rgba(0,0,0,0.8),
          0 0 20px rgba(59,130,246,0.15),
          0 0 40px rgba(168,85,247,0.1)
        `,
        overflow: 'hidden',
      }}>
        {/* Scanlines overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          )`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Iris + Pupil — tracks cursor */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '20%',
            borderRadius: '50%',
            translateX,
            translateY,
          }}
        >
          {/* Iris */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 40% 35%,
                rgba(96,165,250,0.9) 0%,
                rgba(59,130,246,0.8) 30%,
                rgba(109,40,217,0.7) 60%,
                rgba(76,29,149,0.9) 80%,
                rgba(15,10,30,1) 100%
              )
            `,
            boxShadow: '0 0 12px rgba(59,130,246,0.5), inset 0 0 8px rgba(168,85,247,0.3)',
            position: 'relative',
          }}>
            {/* Iris texture rings */}
            <svg
              viewBox="0 0 60 60"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}
            >
              {[22, 18, 14, 10].map((r) => (
                <circle key={r} cx="30" cy="30" r={r}
                  fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                return (
                  <line key={i}
                    x1={30 + Math.cos(angle) * 8}
                    y1={30 + Math.sin(angle) * 8}
                    x2={30 + Math.cos(angle) * 22}
                    y2={30 + Math.sin(angle) * 22}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>

            {/* Pupil */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '36%',
              height: '36%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #000 60%, #0a0520 100%)',
              boxShadow: '0 0 6px rgba(0,0,0,0.8)',
            }} />

            {/* Specular highlight */}
            <div style={{
              position: 'absolute',
              top: '18%',
              left: '24%',
              width: '20%',
              height: '20%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.55)',
              filter: 'blur(2px)',
            }} />
          </div>
        </motion.div>
      </div>

      {/* ── Corner bracket decorations ─────────────────────────── */}
      {[
        { top: '4px', left: '4px', rotate: 0 },
        { top: '4px', right: '4px', rotate: 90 },
        { bottom: '4px', right: '4px', rotate: 180 },
        { bottom: '4px', left: '4px', rotate: 270 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: '18px',
            height: '18px',
            borderTop: i === 0 || i === 1 ? '2px solid rgba(59,130,246,0.7)' : 'none',
            borderBottom: i === 2 || i === 3 ? '2px solid rgba(59,130,246,0.7)' : 'none',
            borderLeft: i === 0 || i === 3 ? '2px solid rgba(59,130,246,0.7)' : 'none',
            borderRight: i === 1 || i === 2 ? '2px solid rgba(59,130,246,0.7)' : 'none',
          }}
        />
      ))}

      {/* ── Status label ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '-28px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.15em',
        color: 'rgba(59,130,246,0.6)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#22c55e',
          marginRight: '6px',
          verticalAlign: 'middle',
          boxShadow: '0 0 6px rgba(34,197,94,0.8)',
          animation: 'pulseGreen 2s ease-in-out infinite',
        }} />
        vision.sys — online
      </div>
    </div>
  );
}
