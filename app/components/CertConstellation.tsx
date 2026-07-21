/**
 * CertConstellation — Orbital Azure Hub
 *
 * Visual targets (matching reference mockup):
 *  - Deep space background (#020408) with dense scattered star field
 *  - Large central Azure "A" hub with multi-layer radial glow + bright core
 *  - 3 tilted 3D orbital rings via CSS perspective(1200px) + rotateX + rotateZ
 *  - Animated comet on the middle orbital ring
 *  - 4 cert cards at diagonal positions, same existing card shape
 *  - GSAP float + spring hover animations
 *  - Section fades seamlessly to #0a0a0a
 */
import { useEffect, useRef } from 'react';
import { certifications } from '../data/certifications';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Palette ───────────────────────────────────────────────────────────────────
const AZURE      = '0, 120, 212';
const AZURE_LITE = '80, 175, 255';
const PURPLE     = '140, 80, 240';

// ── Badge tier config ─────────────────────────────────────────────────────────
const BADGE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  Expert:    { bg: 'rgba(139,92,246,0.22)',  color: '#c084fc', border: 'rgba(192,132,252,0.35)', label: '★ Expert'    },
  Associate: { bg: 'rgba(0,120,212,0.20)',   color: '#38bdf8', border: 'rgba(56,189,248,0.35)',  label: '◆ Associate' },
};

// ── Orbit card positions (45° / 135° / 225° / 315°, r = 285px) ───────────────
// Landscape cards: wider than tall, pushed further from hub
const R = 285;
const CARD_W = 252;  // landscape width
const CARD_H = 155;  // landscape height
const POSITIONS = [45, 135, 225, 315].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { dx: Math.round(R * Math.sin(a)), dy: Math.round(-R * Math.cos(a)) };
});

// ── Stars: 70 scattered across the whole section ──────────────────────────────
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: (Math.random() * 100).toFixed(2),   // % left
  y: (Math.random() * 100).toFixed(2),   // % top
  s: (0.7 + Math.random() * 2.2).toFixed(1),
  op: (0.15 + Math.random() * 0.55).toFixed(2),
  dur: (1.5 + Math.random() * 3.5).toFixed(1),
  delay: (Math.random() * 4).toFixed(1),
}));


// ── Main component ────────────────────────────────────────────────────────────
export function CertConstellation() {
  const sectionRef  = useRef<HTMLElement>(null);
  const hubRef      = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const floats      = useRef<gsap.core.Tween[]>([]);

  // ── Injected CSS ────────────────────────────────────────────────────────────
  const CSS = `
    /* Stars twinkle */
    @keyframes starTwinkle {
      0%, 100% { opacity: var(--op); transform: scale(1); }
      50%       { opacity: calc(var(--op) * 0.3); transform: scale(0.7); }
    }
    /* Hub pulse */
    @keyframes hubPulse {
      0%, 100% {
        box-shadow:
          0 0 0 0px rgba(${AZURE},0),
          0 0 60px 20px rgba(${AZURE},0.45),
          0 0 120px 40px rgba(${AZURE},0.18),
          0 0 200px 80px rgba(${PURPLE},0.08);
      }
      50% {
        box-shadow:
          0 0 0 6px rgba(${AZURE_LITE},0.1),
          0 0 80px 30px rgba(${AZURE},0.65),
          0 0 160px 60px rgba(${AZURE},0.25),
          0 0 240px 100px rgba(${PURPLE},0.12);
      }
    }
    /* Comet on orbital ring 2 */
    @keyframes cometSpin {
      from { transform: perspective(1200px) rotateX(78deg) rotateZ(-15deg) rotate(0deg); }
      to   { transform: perspective(1200px) rotateX(78deg) rotateZ(-15deg) rotate(360deg); }
    }
    /* Outer ring slow drift */
    @keyframes ringDrift {
      0%, 100% { opacity: 0.25; }
      50%       { opacity: 0.45; }
    }
    /* Card border glow on hover */
    .cert-card-orb {
      cursor: pointer;
      transition: border-color 0.35s ease, box-shadow 0.35s ease;
    }
    .cert-card-orb:hover {
      border-color: rgba(${AZURE_LITE}, 0.6) !important;
      box-shadow:
        0 0 0 1px rgba(${AZURE_LITE},0.25),
        0 20px 60px rgba(0,0,0,0.65),
        0 0 40px rgba(${AZURE},0.22) !important;
    }

    /* ── Mobile: hide orbit, show stacked grid ────────────────────────── */
    @media (max-width: 767px) {
      .cert-orbit-wrap  { display: none !important; }
      .cert-mobile-grid { display: flex !important; }
    }
    @media (min-width: 768px) {
      .cert-mobile-grid { display: none !important; }
    }

    /* Mobile card grid */
    .cert-mobile-grid {
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 0 16px;
      width: 100%;
    }

    /* Mobile hub */
    .cert-mobile-hub {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90px; height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle at 40% 35%,
        rgba(255,255,255,0.9) 0%,
        rgba(${AZURE_LITE},0.8) 15%,
        rgba(${AZURE},0.6) 38%,
        rgba(${AZURE},0.25) 60%,
        transparent 75%),
        radial-gradient(circle, rgba(${AZURE},0.4) 0%, rgba(${AZURE},0.12) 55%, transparent 75%);
      box-shadow:
        0 0 40px 12px rgba(${AZURE},0.4),
        0 0 80px 24px rgba(${AZURE},0.18);
      margin: 0 auto 28px;
      animation: hubPulse 4.5s ease-in-out infinite;
    }

    /* Mobile cert cards: 2-col on wider phones, 1-col on small phones */
    .cert-mobile-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
      max-width: 520px;
    }
    @media (max-width: 479px) {
      .cert-mobile-cards-grid { grid-template-columns: 1fr; max-width: 360px; }
    }

    /* Mobile individual cert card */
    .cert-mobile-card {
      background: linear-gradient(145deg, rgba(8,16,32,0.95) 0%, rgba(16,30,56,0.88) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(80,175,255,0.15);
      border-radius: 14px;
      padding: 14px 14px 12px;
      cursor: pointer;
      transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
    }
    .cert-mobile-card:hover {
      border-color: rgba(${AZURE_LITE},0.45);
      box-shadow: 0 0 24px rgba(${AZURE},0.2);
      transform: translateY(-3px);
    }
  `;


  // ── GSAP effects ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Initial hidden state
    cards.forEach((c, i) => {
      const { dx, dy } = POSITIONS[i];
      gsap.set(c, { opacity: 0, x: dx * 1.7, y: dy * 1.7, scale: 0.55 });
    });
    if (hubRef.current) gsap.set(hubRef.current, { opacity: 0, scale: 0.4 });

    // Reveal on scroll
    const reveal = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        // Hub
        if (hubRef.current) {
          gsap.to(hubRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)' });
        }

        // Cards cascade in
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 1,
            delay: 0.3 + i * 0.13,
            ease: 'power3.out',
            onComplete: () => {
              const t = gsap.to(card, {
                y: `${-10 + (i % 2 ? 6 : 0)}`,
                duration: 2.2 + i * 0.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: i * 0.35,
              });
              floats.current.push(t);
            },
          });
        });
      },
    });

    // Hover spring
    cards.forEach((card) => {
      const pause  = () => { floats.current.find(t => (t.targets() as Element[]).includes(card))?.pause(); };
      const resume = () => { floats.current.find(t => (t.targets() as Element[]).includes(card))?.resume(); };

      const onIn  = () => { pause();  gsap.to(card, { y: -16, scale: 1.04, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }); };
      const onOut = () => { resume(); gsap.to(card, { y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' }); };
      const onClick = () => gsap.fromTo(card, { scale: 1.04 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' });

      card.addEventListener('mouseenter', onIn);
      card.addEventListener('mouseleave', onOut);
      card.addEventListener('click', onClick);
    });

    return () => {
      reveal.kill();
      floats.current.forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        /* Deep space base — distinct from the site's #0a0a0a */
        background: 'radial-gradient(ellipse 90% 70% at 50% 55%, #040d1a 0%, #020408 60%, #010204 100%)',
        padding: '80px 0 100px',
        borderTop: 'none',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Scattered star field ─────────────────────────────────────────── */}
      {STARS.map((s) => (
        <div
          key={s.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.s}px`, height: `${s.s}px`,
            borderRadius: '50%',
            background: s.id % 5 === 0 ? `rgba(${AZURE_LITE},0.9)` : 'rgba(255,255,255,0.88)',
            opacity: +s.op,
            ['--op' as string]: s.op,
            animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: '48px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p className="section-label">// Azure Certifications</p>
        <h2 style={{ fontSize: '36px' }}>Cloud Credentials</h2>
        <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '15px', maxWidth: '440px', margin: '10px auto 0' }}>
          Validation of Expertise in Cloud and AI Solutions
        </p>
      </div>

      {/* ── Orbital system container ─────────────────────────────────────── */}
      <div className="cert-orbit-wrap" style={{
        position: 'relative',
        width: '940px',
        height: '860px',
        margin: '0 auto',
      }}>

        {/* ── Background nebula glow (large radial behind hub) ─────────── */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px', height: '560px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${AZURE},0.18) 0%, rgba(${AZURE},0.07) 35%, rgba(${PURPLE},0.04) 60%, transparent 75%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* ── Orbital rings (CSS 3D perspective tilt) ───────────────────── */}

        {/* Ring 1 — inner, blue */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '380px', height: '380px',
          marginLeft: '-190px', marginTop: '-190px',
          borderRadius: '50%',
          border: '1.5px solid rgba(80,175,255,0.55)',
          boxShadow: '0 0 18px rgba(80,175,255,0.35), inset 0 0 18px rgba(80,175,255,0.08)',
          transform: 'perspective(1200px) rotateX(76deg) rotateZ(10deg)',
          pointerEvents: 'none',
          zIndex: 2,
          animation: 'ringDrift 5s ease-in-out infinite',
        }} />

        {/* Ring 2 — middle, blue-white brighter */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '540px', height: '540px',
          marginLeft: '-270px', marginTop: '-270px',
          borderRadius: '50%',
          border: '2px solid rgba(${AZURE_LITE},0.50)',
          borderColor: `rgba(${AZURE_LITE},0.50)`,
          boxShadow: `0 0 24px rgba(${AZURE_LITE},0.40), inset 0 0 16px rgba(${AZURE_LITE},0.06)`,
          transform: 'perspective(1200px) rotateX(78deg) rotateZ(-15deg)',
          pointerEvents: 'none',
          zIndex: 2,
          animation: 'ringDrift 6.5s 1s ease-in-out infinite',
        }} />

        {/* Ring 3 — outer, purple accent */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '680px', height: '680px',
          marginLeft: '-340px', marginTop: '-340px',
          borderRadius: '50%',
          border: '1.5px solid rgba(140,80,240,0.35)',
          boxShadow: '0 0 20px rgba(140,80,240,0.20)',
          transform: 'perspective(1200px) rotateX(80deg) rotateZ(25deg)',
          pointerEvents: 'none',
          zIndex: 2,
          animation: 'ringDrift 8s 2s ease-in-out infinite',
        }} />

        {/* ── Comet on ring 2 (rotates in same perspective plane) ───────── */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '0', height: '0',
          transform: 'perspective(1200px) rotateX(78deg) rotateZ(-15deg)',
          animation: 'cometSpin 9s linear infinite',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          {/* Comet head */}
          <div style={{
            position: 'absolute',
            top: '-4px', left: '267px',   /* 267 ≈ ring2 radius (540/2) – 3px */
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 8px 4px rgba(120,200,255,0.9), 0 0 20px 8px rgba(80,175,255,0.5)',
          }} />
          {/* Comet tail (behind head, shorter) */}
          <div style={{
            position: 'absolute',
            top: '-2px', left: '218px',
            width: '48px', height: '4px',
            background: 'linear-gradient(to right, transparent, rgba(80,175,255,0.6), rgba(120,220,255,0.9))',
            borderRadius: '2px',
            filter: 'blur(1px)',
          }} />
        </div>

        {/* ── Central Hub ───────────────────────────────────────────────── */}
        <div
          ref={hubRef}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '160px', height: '160px',
            borderRadius: '50%',
            /* Multi-layer radial gradient: bright white-blue core → azure → transparent */
            background: `
              radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95) 0%, rgba(${AZURE_LITE},0.9) 15%, rgba(${AZURE},0.7) 38%, rgba(${AZURE},0.3) 60%, transparent 75%),
              radial-gradient(circle, rgba(${AZURE},0.45) 0%, rgba(${AZURE},0.15) 55%, transparent 75%)
            `,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'hubPulse 4.5s ease-in-out infinite',
            zIndex: 10,
          }}
        >
          {/* Inner glass ring */}
          <div style={{
            position: 'absolute', inset: '-24px', borderRadius: '50%',
            border: `2px solid rgba(${AZURE_LITE},0.55)`,
            boxShadow: `0 0 30px rgba(${AZURE},0.4), inset 0 0 20px rgba(${AZURE},0.15)`,
          }} />
          {/* Outer faint ring */}
          <div style={{
            position: 'absolute', inset: '-50px', borderRadius: '50%',
            border: `1px solid rgba(${AZURE},0.22)`,
          }} />
          {/* Real Azure logo — 58px, balanced inside the 160px hub */}
          <img
            src="/images/azure.png"
            alt="Microsoft Azure"
            style={{
              width: '58px',
              height: '58px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(80,175,255,0.7)) drop-shadow(0 0 4px rgba(255,255,255,0.4))',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>


        {/* ── Certification cards — landscape layout ──────────────────────── */}
        {certifications.map((cert, i) => {
          const { dx, dy } = POSITIONS[i];
          const badge = cert.badge ? (BADGE[cert.badge] ?? BADGE.Associate) : null;

          return (
            <div
              key={cert.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="cert-card-orb"
              onClick={() => window.open(cert.verifyUrl, '_blank')}
              style={{
                position: 'absolute',
                left: `calc(50% + ${dx}px - ${CARD_W / 2}px)`,
                top: `calc(50% + ${dy}px - ${CARD_H / 2}px)`,
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,          /* fixed height = true landscape */
                background: 'linear-gradient(145deg, rgba(8,16,32,0.95) 0%, rgba(16,30,56,0.88) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(80,175,255,0.15)',
                borderRadius: '14px',
                padding: '13px 14px 11px',
                zIndex: 8,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* ── Row 1: badge icon + code + tier pill (all in one line) ── */}
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '7px', marginBottom: '7px',
              }}>
                <img
                  src={
                    cert.badge === 'Expert'
                      ? 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-expert-badge.svg'
                      : 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg'
                  }
                  alt={`Microsoft Certified ${cert.badge}`}
                  style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '0.05em',
                  color: 'rgba(148,163,184,0.65)',
                  flex: 1,
                }}>
                  {cert.code}
                </span>
                {badge && (
                  <span style={{
                    fontSize: '8.5px', fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    padding: '2px 6px', borderRadius: '3px', flexShrink: 0,
                    background: badge.bg, color: badge.color,
                    border: `1px solid ${badge.border}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {badge.label}
                  </span>
                )}
              </div>

              {/* ── Row 2: title (bold, 2-line clamp) ──────────────────────── */}
              <h4 style={{
                fontSize: '13px', fontWeight: 700, color: '#fff',
                lineHeight: 1.3, margin: '0 0 6px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } as React.CSSProperties}>
                {cert.title}
              </h4>

              {/* ── Row 3: description (2-line clamp) ──────────────────────── */}
              <p style={{
                fontSize: '11px', color: 'rgba(148,163,184,0.78)',
                lineHeight: 1.5, margin: '0 0 8px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
              } as React.CSSProperties}>
                {cert.description}
              </p>

              {/* ── Row 4: verify link ──────────────────────────────────────── */}
              <span style={{
                fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 500,
                color: `rgba(${AZURE_LITE}, 0.80)`,
                marginTop: 'auto',
              }}>
                Verify on Microsoft Learn →
              </span>
            </div>
          );
        })}
      </div>
      {/* ── Mobile card grid (hidden on desktop) ─────────────────────── */}
      <div className="cert-mobile-grid">
        {/* Compact Azure hub */}
        <div className="cert-mobile-hub">
          <img
            src="/images/azure.png"
            alt="Microsoft Azure"
            style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(80,175,255,0.9)) drop-shadow(0 0 20px rgba(56,145,255,0.6))' }}
          />
        </div>

        {/* 2-col (mobile) or 1-col (small phone) card grid */}
        <div className="cert-mobile-cards-grid">
          {certifications.map((cert) => {
            const badge = cert.badge ? (BADGE[cert.badge] ?? BADGE.Associate) : null;
            return (
              <div
                key={cert.id}
                className="cert-mobile-card"
                onClick={() => window.open(cert.verifyUrl, '_blank')}
              >
                {/* Top: badge icon + code + tier pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <img
                      src={cert.badge === 'Expert'
                        ? 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-expert-badge.svg'
                        : 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg'
                      }
                      alt={cert.code}
                      style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                      color: 'rgba(148,163,184,0.85)', letterSpacing: '0.04em',
                    }}>{cert.code}</span>
                  </div>
                  {badge && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                      letterSpacing: '0.06em', fontFamily: 'var(--font-mono)',
                      color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 5px' }}>
                  {cert.title}
                </h4>

                {/* Description */}
                <p style={{
                  fontSize: '10px', color: 'rgba(148,163,184,0.72)', lineHeight: 1.5, margin: '0 0 8px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}>
                  {cert.description}
                </p>

                {/* Verify link */}
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: `rgba(${AZURE_LITE},0.8)`, fontWeight: 500 }}>
                  Verify on Microsoft Learn →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section boundary fades ────────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
        pointerEvents: 'none', zIndex: 20,
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to top, #0a0a0a, transparent)',
        pointerEvents: 'none', zIndex: 20,
      }} />
    </section>
  );
}
