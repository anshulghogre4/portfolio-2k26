import { useRef, useEffect } from "react";
import { profile } from "../data/profile";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, createScope, type Scope } from "animejs";
import { prefersReducedMotion } from "../lib/motionPrefs";
import { HeroWebGL } from "./HeroWebGL";
import { SoundToggle } from "./SoundToggle";
import { BlurTextReveal } from "./BlurTextReveal";
import { getLenis } from "../lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  // ── GSAP: hero text entrance (staggered after WebGL boot-up) ──────────────
  useGSAP(() => {
    gsap.set(heroRef.current, { autoAlpha: 1 });

    if (prefersReducedMotion()) return;

    // Stagger text in after WebGL nodes assemble (~1.3s into load)
    const tl = gsap.timeline({ delay: 1.2 });

    if (subRef.current) {
      tl.fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      );
    }

    // Scroll parallax: text drifts up as user scrolls
    gsap.to(textRef.current, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }, { scope: heroRef });

  // ── Anime.js: magnetic CTA buttons ────────────────────────────────────────
  useMagnetic('.magnetic-btn');

  return (
    <section
      ref={heroRef}
      className="js-hide"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '80px 0',
      }}
    >
      {/* Full-screen neural network WebGL */}
      <HeroWebGL />

      {/* Mobile fallback — CSS orbs shown only on touch devices (pointer: coarse) */}
      <div className="hero-mobile-orbs" aria-hidden="true" />

      {/* Bottom-fade: dissolves neural network into page background */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '220px',
        background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Sound toggle */}
      <SoundToggle />


      {/* Hero content — centered, on top of WebGL */}
      <div
        ref={textRef}
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        {/* Role label — BlurTextReveal kicks in at delay 0.1 */}
        <div style={{ marginBottom: '20px' }}>
          <BlurTextReveal
            text={profile.roles.join(' · ')}
            elementType="p"
            delay={0.4}
            className="role-text"
          />
        </div>

        {/* Main tagline h1 */}
        <div style={{ marginBottom: '28px' }}>
          <BlurTextReveal
            text={profile.tagline}
            elementType="h1"
            delay={0.7}
          />
        </div>

        {/* Hero statement — fades in after WebGL assembly */}
        <p
          ref={subRef}
          style={{
            fontSize: '17px',
            lineHeight: 1.85,
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 48px',
            opacity: 0,
          }}
        >
          {profile.heroStatement}
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
          }}
        >
          <a
            href="#projects"
            className="magnetic-btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              getLenis()?.scrollTo('#projects', { offset: -64 });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '8px',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: '0 0 30px rgba(59,130,246,0.35)',
            }}
          >
            View Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href="#contact"
            className="magnetic-btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              getLenis()?.scrollTo('#contact', { offset: -64 });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '15px',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(8px)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            Get in Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-tertiary)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.6))',
              animation: 'pulseDown 2s ease-in-out infinite',
            }}
          />
          scroll
        </div>
      </div>
    </section>
  );
}

// ── Anime.js magnetic hook ────────────────────────────────────────────────────
function useMagnetic(selector: string) {
  useEffect(() => {
    if (
      prefersReducedMotion() ||
      (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches)
    ) return;

    const elements = document.querySelectorAll<HTMLElement>(selector);
    const scopes: Scope[] = [];

    const cleanups = Array.from(elements).map((el) => {
      const scope = createScope({ root: el });
      scopes.push(scope);

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        scope.add(() => {
          animate(el, {
            translateX: (e.clientX - r.left - r.width / 2) * 0.15,
            translateY: (e.clientY - r.top - r.height / 2) * 0.15,
            duration: 300,
            ease: 'outQuad',
          });
        });
      };

      const onLeave = () => {
        scope.add(() => {
          animate(el, {
            translateX: 0,
            translateY: 0,
            duration: 500,
            ease: 'outElastic(1, .6)',
          });
        });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      scopes.forEach((s) => s.revert());
    };
  }, [selector]);
}
