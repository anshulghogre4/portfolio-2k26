import { useRef, useEffect } from "react";
import { skillCategories } from "../data/skills";
import { certifications, education } from "../data/certifications";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, stagger, createScope, type Scope } from "animejs";
import { prefersReducedMotion } from "../lib/motionPrefs";

gsap.registerPlugin(ScrollTrigger);

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // We need a ref to hold all Anime scopes for cleanup
  const animeScopes = useRef<Scope[]>([]);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { autoAlpha: 1 });
      return;
    }
    
    gsap.set(sectionRef.current, { autoAlpha: 1 });

    // GSAP watches scroll, Anime does the flourish
    skillCategories.forEach((cat) => {
      ScrollTrigger.create({
        trigger: `#skill-cat-${cat.id}`,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const el = document.getElementById(`skill-cat-${cat.id}`);
          if (!el) return;
          const scope = createScope({ root: el });
          animeScopes.current.push(scope);
          
          scope.add(() => {
            animate('.pill', {
              opacity: [0, 1],
              translateY: [12, 0],
              scale: [0.9, 1],
              delay: stagger(40),
              duration: 450,
              ease: 'outQuad',
            });
          });
        },
      });
    });

    // Flip-in reveal for certifications & education
    ScrollTrigger.create({
      trigger: '.certs-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const els = document.querySelectorAll('.certs-grid .card');
        if (!els.length) return;
        const scope = createScope({ root: sectionRef.current! });
        animeScopes.current.push(scope);

        scope.add(() => {
          animate('.certs-grid .card', {
            rotateY: [-15, 0],
            opacity: [0, 1],
            delay: stagger(80, { from: 'first' }),
            duration: 600,
            ease: 'outQuad',
          });
        });
      },
    });
  }, { scope: sectionRef });

  // Cleanup Anime scopes on unmount
  useEffect(() => {
    return () => {
      animeScopes.current.forEach(scope => scope.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="section js-hide">
      <div className="container">
        <p className="section-label">Skills & Certifications</p>
        <h2 style={{ marginBottom: '64px' }}>What I Work With</h2>

        {/* Skill Categories */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          marginBottom: '80px',
        }}>
          {skillCategories.map((cat) => (
            <div key={cat.id} id={`skill-cat-${cat.id}`}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-primary)',
              }}>
                {cat.label}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                marginBottom: '14px',
              }}>
                {cat.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cat.skills.map((skill) => (
                  <span key={skill.name} className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: prefersReducedMotion() ? 1 : 0 }}>
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        style={{
                          width: '14px',
                          height: '14px',
                          objectFit: 'contain',
                          flexShrink: 0,
                          filter: skill.icon.includes('000000') ? 'invert(1)' : 'none',
                        }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <hr className="divider" />
        <h3 style={{ 
          fontSize: '20px', 
          marginBottom: '24px',
          color: 'var(--text-primary)'
        }}>
          Education
        </h3>
        <div
          className="certs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          {education.map((cert) => (
            <a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="card project-3d-card"
              style={{ 
                textDecoration: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                borderRadius: '16px',
                padding: '24px',
                opacity: prefersReducedMotion() ? 1 : 0 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cert.logo && (
                    <img
                      src={cert.logo}
                      alt={cert.code}
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        objectFit: 'contain', 
                        flexShrink: 0, 
                        background: cert.logoBg ?? 'transparent',
                        borderRadius: '8px',
                        padding: cert.logoBg ? '6px' : '0'
                      }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {cert.code}
                  </p>
                </div>
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>
                {cert.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                {cert.description}
              </p>
              {cert.verifyUrl && cert.verifyUrl !== '#' && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 500 }}>Verify Credential →</span>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Azure Certifications */}
        <h3 style={{ 
          fontSize: '20px', 
          marginBottom: '24px',
          color: 'var(--text-primary)'
        }}>
          Azure Certifications
        </h3>
        <div
          className="certs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {certifications.map((cert) => (
            <a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="card project-3d-card"
              style={{ 
                textDecoration: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                borderRadius: '16px',
                padding: '24px',
                opacity: prefersReducedMotion() ? 1 : 0 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={
                      cert.badge === 'Expert'
                        ? 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-expert-badge.svg'
                        : 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg'
                    }
                    alt={`Microsoft Certified ${cert.badge}`}
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      objectFit: 'contain', 
                      flexShrink: 0, 
                      background: 'transparent',
                      borderRadius: '8px',
                      padding: '0'
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {cert.code}
                  </p>
                </div>
                {cert.badge && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    flexShrink: 0,
                    background: cert.badge === 'Expert'
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(217,70,239,0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(0,120,212,0.25) 0%, rgba(45,172,249,0.2) 100%)',
                    color: cert.badge === 'Expert' ? '#c084fc' : '#38bdf8',
                    border: `1px solid ${cert.badge === 'Expert' ? 'rgba(192,132,252,0.3)' : 'rgba(56,189,248,0.3)'}`,
                    alignSelf: 'center',
                  }}>
                    {cert.badge === 'Expert' ? '★ Expert' : '◆ Associate'}
                  </span>
                )}
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>
                {cert.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                {cert.description}
              </p>
              {cert.verifyUrl && cert.verifyUrl !== '#' && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 500 }}>Verify on Microsoft Learn →</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
