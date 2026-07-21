import { useRef, useEffect } from "react";
import { skillCategories } from "../data/skills";
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
      </div>
    </section>
  );
}
