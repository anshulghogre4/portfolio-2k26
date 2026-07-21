import { useRef } from "react";
import { experiences } from "../data/experience";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motionPrefs";

gsap.registerPlugin(ScrollTrigger);

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { autoAlpha: 1 });
      gsap.set(".work-entry", { autoAlpha: 1 });
      return;
    }
    
    gsap.set(sectionRef.current, { autoAlpha: 1 });

    // Progress line animation
    gsap.to('.work-progress-line', {
      scaleY: 1,
      transformOrigin: 'top',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: true,
      },
    });

    // Fade in entries as user scrolls down
    const entries = gsap.utils.toArray<HTMLElement>('.work-entry');
    entries.forEach((entry, i) => {
      gsap.fromTo(entry, 
        { opacity: 0.2, x: 20 },
        { 
          opacity: 1, 
          x: 0,
          scrollTrigger: {
            trigger: entry,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="work" className="section js-hide">
      <div className="container">
        <p className="section-label">Experience</p>
        <h2 style={{ marginBottom: '64px' }}>Where I've Worked</h2>

        <div ref={containerRef} style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Progress Line Track */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '6px', // Align with timeline
            width: '2px',
            height: '100%',
            background: 'var(--border-subtle)',
            borderRadius: '2px',
          }} />
          
          {/* Active Progress Line */}
          <div className="work-progress-line" style={{
            position: 'absolute',
            top: 0,
            left: '6px', // Align with timeline
            width: '2px',
            height: '100%',
            background: 'var(--accent-blue)',
            borderRadius: '2px',
            transform: 'scaleY(0)',
          }} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="card work-entry"
                style={{ position: 'relative' }}
              >
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-23px', // 24px padding - 6px line pos + slight adjustment
                  top: '40px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--accent-blue)',
                  zIndex: 2,
                }} />
                
                <div
                  className="work-card-inner"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                    gap: '32px',
                  }}
                >
                  {/* Left: Meta */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                    }}>
                      {exp.period}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                    }}>
                      {exp.location}
                    </p>
                  </div>

                  {/* Right: Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
                      {exp.companyLogo && (
                        <img 
                          src={exp.companyLogo} 
                          alt={exp.company} 
                          style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain', background: '#fff', padding: '2px' }}
                        />
                      )}
                      <h3 style={{ fontSize: '17px', margin: 0 }}>
                        {exp.role}
                      </h3>
                    </div>
                    <p style={{
                      fontSize: '15px',
                      color: 'var(--accent-blue)',
                      marginBottom: '12px',
                      fontWeight: 500,
                    }}>
                      {exp.company}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      marginBottom: '16px',
                      lineHeight: 1.7,
                    }}>
                      {exp.description}
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '16px',
                    }}>
                      {exp.highlights.map((h, i) => (
                        <li key={i} style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          paddingLeft: '16px',
                          position: 'relative',
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: 'var(--text-tertiary)',
                          }}>→</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {exp.techStack.map((tech) => (
                        <span key={tech} className="pill" style={{ fontSize: '12px', padding: '4px 10px' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
