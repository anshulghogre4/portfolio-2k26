import { useRef } from "react";
import { profile } from "../data/profile";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, useMotionValue, useSpring } from "motion/react";
import { prefersReducedMotion } from "../lib/motionPrefs";
import { ParticleSphere } from "./ParticleSphere";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);

  // Motion values for 3D photo card tilt
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const springRotX = useSpring(rawRotX, { stiffness: 200, damping: 25 });
  const springRotY = useSpring(rawRotY, { stiffness: 200, damping: 25 });

  useGSAP(() => {
    gsap.set(sectionRef.current, { autoAlpha: 1 });

    if (prefersReducedMotion()) return;

    const splitHeading = new SplitText(headingRef.current, {
      type: "words,chars",
      charsClass: "split-char",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    tl.fromTo(
      splitHeading.chars,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.02, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(
      ".about-photo-wrap",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(
      ".about-bio",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(
      ".pillars-grid .card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
  }, { scope: sectionRef });

  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    rawRotX.set(-y * 18);
    rawRotY.set( x * 18);
  };

  const handlePhotoMouseLeave = () => {
    rawRotX.set(0);
    rawRotY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section js-hide"
      style={{ position: 'relative', overflow: 'hidden', borderTop: 'none' }}
    >
      {/* ── Orb background (re-instating the original animated orbs) ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {/* Top-fade — particle sphere emerges smoothly from page background */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '220px',
          background: 'linear-gradient(to top, transparent 0%, #0a0a0a 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Blue orb — top-left */}
        <div style={{
          position: 'absolute',
          top: '-5%', left: '-8%',
          width: '55vw', height: '55vw',
          maxWidth: '700px', maxHeight: '700px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 68%)',
          filter: 'blur(48px)',
          animation: 'floatOrb1 10s ease-in-out infinite',
        }} />
        {/* Purple orb — bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: '-10%', right: '-5%',
          width: '60vw', height: '60vw',
          maxWidth: '800px', maxHeight: '800px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 68%)',
          filter: 'blur(60px)',
          animation: 'floatOrb2 14s ease-in-out infinite reverse',
        }} />

        {/* Original particle sphere — restored as ambient 3D background */}
        <ParticleSphere opacity={0.5} />
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
        }} />

        {/* Bottom-fade: sphere dissolves into page background before next section */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <p className="section-label">About</p>
        <h2 ref={headingRef} style={{ marginBottom: '48px' }}>
          The FDE Mindset
        </h2>

        {/* ── Top row: photo card (left) + bio text (right) ──────────── */}
        <div
          className="about-top-row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '56px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
        >
          {/* ── Photo card with 3D tilt ──────────────────────────────── */}
          <div className="about-photo-wrap" style={{ opacity: 0 }}>
            <motion.div
              ref={photoRef}
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
              style={{
                rotateX: springRotX,
                rotateY: springRotY,
                transformStyle: 'preserve-3d',
                transformPerspective: 1000,
                willChange: 'transform',
                borderRadius: '20px',
                cursor: 'default',
              }}
            >
              <div style={{
                width: '220px',
                height: '265px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: `
                  0 24px 64px rgba(0,0,0,0.6),
                  0 0 0 1px rgba(59,130,246,0.15),
                  inset 0 1px 0 rgba(255,255,255,0.08)
                `,
                position: 'relative',
                background: '#0d1117',
              }}>
                <img
                  src="/images/Anshul_Ghogre.png"
                  alt="Anshul Ghogre — Applied AI Engineer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
                {/* Gradient overlay at bottom */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.45) 100%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Name tag */}
              <div style={{
                marginTop: '14px',
                textAlign: 'center',
                transform: 'translateZ(20px)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: 'var(--accent-blue)',
                  textTransform: 'uppercase',
                }}>
                  Anshul Ghogre
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                  Applied AI · FDE
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Bio text + stats ─────────────────────────────────────── */}
          <div className="about-bio" style={{ opacity: 0 }}>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.85,
              color: 'var(--text-secondary)',
              marginBottom: '32px',
              maxWidth: '620px',
            }}>
              {profile.fdePhilosophy}
            </p>

            {/* Key stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { label: 'Experience', value: '3+ yrs' },
                { label: 'Projects',   value: '20+' },
                { label: 'Focus',      value: 'AI / FDE' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    marginTop: '3px',
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Four Pillars ─────────────────────────────────────────────── */}
        <div
          className="pillars-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {profile.pillars.map((pillar, i) => (
            <div key={i} className="card">
              <h3 style={{ fontSize: '17px', marginBottom: '12px', fontWeight: 600 }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .about-top-row {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 36px !important;
          }
          .about-photo-wrap { margin: 0 auto; }
          .about-bio { max-width: 100%; }
          .pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </section>
  );
}
