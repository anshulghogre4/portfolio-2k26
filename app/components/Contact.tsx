import { useRef, MouseEvent, useEffect } from "react";
import { profile } from "../data/profile";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motionPrefs";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const xTo = useRef<Function>();
  const yTo = useRef<Function>();

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { autoAlpha: 1 });
      return;
    }
    
    gsap.set(sectionRef.current, { autoAlpha: 1 });



    if (containerRef.current) {
      xTo.current = gsap.quickTo(containerRef.current, "rotationY", { ease: "power3", duration: 0.6 });
      yTo.current = gsap.quickTo(containerRef.current, "rotationX", { ease: "power3", duration: 0.6 });
    }
  }, { scope: sectionRef });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !containerRef.current || !xTo.current || !yTo.current) return;
    
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    xTo.current(x * 15);
    yTo.current(y * -15);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion() || !xTo.current || !yTo.current) return;
    xTo.current(0);
    yTo.current(0);
  };

  return (
    <section ref={sectionRef} id="contact" className="section relative" style={{ overflow: 'hidden', padding: '120px 0' }}>
      
      {/* Immersive Glassy Refraction Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 mix-blend-screen" 
             style={{ background: 'radial-gradient(circle, #a78bfa 0%, #3b82f6 50%, transparent 80%)' }} />
      </div>

      <div className="container relative z-10" style={{ perspective: '2000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p className="section-label" style={{ marginBottom: '16px', display: 'inline-block' }}>Contact</p>
          <h2 style={{ 
            fontSize: '4rem', 
            fontWeight: 700, 
            letterSpacing: '-0.02em', 
            background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', 
            WebkitBackgroundClip: 'text', 
            color: 'transparent',
            marginBottom: '16px'
          }}>
            Let's Connect
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            {profile.openTo}
          </p>
        </div>
        
        {/* The 3D Container tracking mouse */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            margin: '0 auto',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <GlassCard title="Email" value={profile.email} link={`mailto:${profile.email}`} />
          <GlassCard title="Phone" value={profile.phone} link={`tel:${profile.phone}`} />
          <GlassCard title="LinkedIn" value="/in/anshulg4" link={profile.linkedin} />
          <GlassCard title="GitHub" value="@anshulghogre4" link={profile.github} />
        </div>
        
        <div style={{
          marginTop: '100px',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          letterSpacing: '0.05em'
        }}>
          Based in {profile.location} · Open to remote opportunities
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 50px 32px;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.02);
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
        }
        
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
          transform: skewX(-25deg);
          transition: all 0.7s ease;
        }

        .glass-card:hover::before {
          left: 200%;
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(167, 139, 250, 0.5);
          transform: translateZ(80px) scale(1.02) !important;
          box-shadow: 0 40px 80px -20px rgba(167, 139, 250, 0.4), inset 0 0 30px rgba(255,255,255,0.08);
        }
        
        .glass-card-title {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-tertiary);
          margin-bottom: 16px;
          transform: translateZ(30px);
          transition: all 0.4s ease;
        }
        
        .glass-card-value {
          font-size: 19px;
          font-weight: 500;
          color: var(--text-primary);
          transform: translateZ(60px);
          transition: all 0.4s ease;
        }
        
        .glass-card:hover .glass-card-title {
          color: #a78bfa;
          transform: translateZ(50px);
        }

        .glass-card:hover .glass-card-value {
          color: #fff;
          transform: translateZ(90px) scale(1.05);
          text-shadow: 0 0 20px rgba(167, 139, 250, 0.6);
        }
      `}} />
    </section>
  );
}

function GlassCard({ title, value, link }: { title: string, value: string, link: string }) {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="glass-card" style={{ transform: 'translateZ(0px)' }}>
      <div className="glass-card-title">{title}</div>
      <div className="glass-card-value">{value}</div>
    </a>
  );
}
