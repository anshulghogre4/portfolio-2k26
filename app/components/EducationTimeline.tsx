/**
 * EducationTimeline — Option 2: Staggered timeline river
 *
 * Layout: vertical glowing spine (center), cards alternate left/right.
 * Animation:
 *  - GSAP ScrollTrigger scrub drives spine fill (sky-blue → purple gradient)
 *  - Spine glow radiates to each card as the fill passes its node
 *  - Cards fly in from their side when they enter the viewport
 *  - Node circles pulse when activated
 */
import { useEffect, useRef } from 'react';
import { education } from '../data/certifications';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Spine color at a given scroll progress (0=sky-blue, 0.5=blue, 1=purple)
function spineRGB(progress: number): string {
  const stops = [
    [56, 189, 248],  // #38bdf8 sky-blue
    [59, 130, 246],  // #3b82f6 blue
    [168, 85, 247],  // #a855f7 purple
  ];
  const t2 = progress * 2;
  const a = stops[Math.min(1, Math.floor(t2))];
  const b = stops[Math.min(2, Math.floor(t2) + 1)];
  const f = t2 - Math.floor(t2);
  return `${Math.round(a[0]+(b[0]-a[0])*f)}, ${Math.round(a[1]+(b[1]-a[1])*f)}, ${Math.round(a[2]+(b[2]-a[2])*f)}`;
}

// Static accent color per card (pre-computed)
const CARD_COLORS = [
  { rgb: '56,189,248',   hex: '#38bdf8' }, // sky-blue   (top)
  { rgb: '80,160,247',   hex: '#50a0f7' }, // mid-blue
  { rgb: '130,100,250',  hex: '#8264fa' }, // violet
  { rgb: '168,85,247',   hex: '#a855f7' }, // purple     (bottom)
];

export function EducationTimeline() {
  const sectionRef  = useRef<HTMLElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // ── Mobile-responsive CSS ─────────────────────────────────────────────
  const MOBILE_CSS = `
    @media (max-width: 767px) {
      /* Spine moves to left edge */
      .edu-spine { left: 28px !important; transform: none !important; }

      /* All items: always row, left-to-right */
      .edu-item { flex-direction: row !important; align-items: flex-start !important; }

      /* Node column: fixed 56px, forced first via order */
      .edu-node-col { width: 56px !important; order: -1; }

      /* Card: takes remaining space, second */
      .edu-card {
        width: calc(100% - 56px) !important;
        order: 1;
        padding: 20px 16px 16px !important;
      }

      /* Spacer: hidden */
      .edu-spacer { display: none !important; }

      /* Connector lines: hidden on mobile (looks clean without them) */
      .edu-connector { display: none !important; }
    }

    @media (max-width: 480px) {
      .edu-card h4 { font-size: 15px !important; }
      .edu-card p  { font-size: 12px !important; }
    }
  `;

  useEffect(() => {
    if (!sectionRef.current || !spineFillRef.current) return;
    const section = sectionRef.current;

    // ── Initial state: cards off to their side ────────────────────────────────
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isLeft = i % 2 === 0;
      gsap.set(card, { opacity: 0, x: isLeft ? -70 : 70 });
    });
    gsap.set(spineFillRef.current, { scaleY: 0, transformOrigin: 'top' });

    // ── Spine fill progress ───────────────────────────────────────────────────
    const spineTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;

        // Grow the fill
        gsap.set(spineFillRef.current!, { scaleY: p });

        // Radiate glow to each card & activate nodes
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const threshold = i / (education.length - 1); // 0, 0.33, 0.67, 1
          const delta     = (p - threshold) / 0.18;     // how far past this card
          const intensity = Math.max(0, Math.min(1, delta));

          if (intensity > 0) {
            const rgb = spineRGB(threshold);
            card.style.borderColor = `rgba(${rgb}, ${intensity * 0.55})`;
            card.style.boxShadow   = `
              0 0 ${intensity * 35}px rgba(${rgb}, ${intensity * 0.18}),
              inset 0 0 ${intensity * 16}px rgba(${rgb}, 0.04)
            `;
          } else {
            card.style.borderColor = 'rgba(255,255,255,0.07)';
            card.style.boxShadow   = 'none';
          }

          // Node pulse
          const node = nodeRefs.current[i];
          if (!node) return;
          const nodeIntensity = Math.max(0, Math.min(1, (p - (threshold - 0.04)) / 0.08));
          if (nodeIntensity > 0.5) {
            const rgb = spineRGB(threshold);
            node.style.backgroundColor = `rgba(${rgb}, 0.9)`;
            node.style.boxShadow = `0 0 ${nodeIntensity * 18}px rgba(${rgb}, 0.9)`;
            node.style.borderColor = `rgba(${rgb}, 0.5)`;
            node.style.transform = `scale(${1 + nodeIntensity * 0.3})`;
          } else {
            node.style.backgroundColor = 'rgba(255,255,255,0.08)';
            node.style.boxShadow = 'none';
            node.style.borderColor = 'rgba(255,255,255,0.2)';
            node.style.transform = 'scale(1)';
          }
        });
      }
    });

    // ── Card fly-in on scroll ─────────────────────────────────────────────────
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isLeft = i % 2 === 0;
      ScrollTrigger.create({
        trigger: card,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.08,
          });
        },
      });
    });

    return () => {
      spineTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 120px',
        borderTop: 'none',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: MOBILE_CSS }} />
      {/* ── Section header ────────────────────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: '72px', textAlign: 'center' }}>
        <p className="section-label">// Education</p>
        <h2 style={{ fontSize: '36px' }}>Academic Foundation</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '480px', margin: '12px auto 0' }}>
          The engineering and AI foundations that shaped my problem-solving lens.
        </p>
      </div>

      {/* ── Timeline container ────────────────────────────────────────────────── */}
      <div className="edu-timeline-container" style={{ position: 'relative', maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Spine track (full height background) */}
        <div
          className="edu-spine"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%', top: 0, bottom: 0,
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1,
          }}
        >
          {/* Animated fill */}
          <div
            ref={spineFillRef}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '100%',
              background: 'linear-gradient(to bottom, #38bdf8 0%, #3b82f6 50%, #a855f7 100%)',
              boxShadow: '0 0 14px rgba(59,130,246,0.9), 0 0 35px rgba(59,130,246,0.45)',
              borderRadius: '1px',
            }}
          />
        </div>

        {/* Timeline items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', paddingTop: '10px', paddingBottom: '10px' }}>
          {education.map((item, i) => {
            const isLeft = i % 2 === 0;
            const accent = CARD_COLORS[i] ?? CARD_COLORS[0];

            return (
              <div
                key={item.id}
                className="edu-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                }}
              >
                {/* Card */}
                <div
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="edu-card"
                  onClick={() => window.open(item.verifyUrl, '_blank')}
                  style={{
                    width: 'calc(50% - 36px)',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(30,41,59,0.72) 100%)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '28px 28px 24px',
                    cursor: 'pointer',
                    transition: 'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease',
                    willChange: 'transform, box-shadow',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  {/* Logo + code row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    {item.logo && (
                      <img
                        src={item.logo}
                        alt={item.code}
                        style={{
                          width: '38px', height: '38px', objectFit: 'contain',
                          borderRadius: '8px',
                          background: item.logoBg ?? 'transparent',
                          padding: item.logoBg ? '5px' : '0',
                          flexShrink: 0,
                        }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: accent.hex,
                      padding: '3px 8px',
                      background: `rgba(${accent.rgb}, 0.12)`,
                      borderRadius: '4px',
                      border: `1px solid rgba(${accent.rgb}, 0.25)`,
                    }}>
                      {item.code}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    fontSize: '16px', fontWeight: 600, color: '#fff',
                    lineHeight: 1.4, margin: '0 0 10px',
                  }}>
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p style={{
                    fontSize: '13px', color: 'var(--text-secondary)',
                    lineHeight: 1.65, margin: '0 0 18px',
                  }}>
                    {item.description}
                  </p>

                  {/* Verify link */}
                  <span style={{
                    fontSize: '12px', color: accent.hex,
                    fontWeight: 500, fontFamily: 'var(--font-mono)',
                  }}>
                    Verify Credential →
                  </span>
                </div>

                {/* Center: connector + node ────────────────────────────────── */}
                <div className="edu-node-col" style={{
                  width: '72px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 2,
                }}>
                  {/* Connector line */}
                  <div className="edu-connector" style={{
                    position: 'absolute',
                    top: '50%',
                    ...(isLeft ? { left: '50%' } : { right: '50%' }),
                    width: '30px', height: '1px',
                    background: `linear-gradient(${isLeft ? 'to right' : 'to left'}, transparent, rgba(${accent.rgb}, 0.35))`,
                    transform: 'translateY(-50%)',
                  }} />

                  {/* Node circle */}
                  <div
                    ref={(el) => { nodeRefs.current[i] = el; }}
                    style={{
                      width: '13px', height: '13px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      flexShrink: 0,
                      transition: 'background-color 0.3s, box-shadow 0.3s, transform 0.3s, border-color 0.3s',
                    }}
                  />
                </div>

                {/* Spacer (opposite side) */}
                <div className="edu-spacer" style={{ width: 'calc(50% - 36px)', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section boundary fades ────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
        pointerEvents: 'none', zIndex: 10,
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to top, #0a0a0a, transparent)',
        pointerEvents: 'none', zIndex: 10,
      }} />
    </section>
  );
}
