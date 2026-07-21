import { useRef } from "react";
import { featuredProjects } from "../data/projects";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { animate } from "animejs";
import { prefersReducedMotion } from "../lib/motionPrefs";

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion() || !trackRef.current) {
      gsap.set(sectionRef.current, { autoAlpha: 1 });
      return;
    }
    
    gsap.set(sectionRef.current, { autoAlpha: 1 });

    const trackWidth = trackRef.current.scrollWidth;
    const windowWidth = window.innerWidth;
    // Calculate the exact scroll distance needed to see the last card.
    // 40vw is the starting padding-left. 
    const scrollDistance = trackWidth - windowWidth + (windowWidth * 0.2); 

    // 1. GSAP Horizontal Scroll & Ribbon Wave
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1.5, // Buttery smooth scrub using Lenis!
        pin: true,
      }
    });

    // Translate the whole track horizontally
    tl.to(trackRef.current, {
      x: -scrollDistance,
      ease: "none",
    }, 0);

    // Apply a 3D wave rotation and Y-axis translation to the cards as they move
    const cards = gsap.utils.toArray(".ribbon-card");
    cards.forEach((card: any, i) => {
      // Initial state
      gsap.set(card, {
        y: i % 2 === 0 ? 50 : -50,
        rotationY: -15,
        rotationZ: i % 2 === 0 ? -3 : 3,
      });

      // Animate them flowing through a sine wave during the scroll
      tl.to(card, {
        y: i % 2 === 0 ? -50 : 50,
        rotationY: 15,
        rotationZ: i % 2 === 0 ? 3 : -3,
        ease: "sine.inOut",
      }, 0);
    });

    // 2. Anime.js SVG Path Animation synced to scroll
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${pathLength}`;
      pathRef.current.style.strokeDashoffset = `${pathLength}`;

      gsap.to({ value: 0 }, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
          onUpdate: (self) => {
            // Drive Anime.js dashoffset using scrub progress for micro-interaction glow
            animate(pathRef.current, {
              strokeDashoffset: pathLength - (pathLength * self.progress),
              duration: 100, 
              ease: 'linear',
            });
          }
        }
      });
    }

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="section js-hide"
      style={{
        overflow: 'hidden',
        padding: '0', 
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* Background SVG Ribbon Path */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: 0,
        width: '200vw',
        height: '60%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.5
      }}>
        <svg width="100%" height="100%" viewBox="0 0 2000 400" preserveAspectRatio="none">
          <path
            ref={pathRef}
            d="M 0,200 C 300,50 600,350 1000,200 C 1400,50 1700,350 2000,200"
            fill="none"
            stroke="url(#ribbon-gradient)"
            strokeWidth="4"
            style={{ filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.8))' }}
          />
          <defs>
            <linearGradient id="ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Title Container (Fixed left position during horizontal scroll) */}
        <div style={{ position: 'absolute', top: '15%', left: '10vw', zIndex: 20 }}>
          <p className="section-label">Projects</p>
          <h2 style={{ marginBottom: '16px' }}>Featured Builds</h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
          }}>
            Personal projects where I apply the FDE mindset — real deployment friction,
            real data, real AI in production.
          </p>
        </div>

        {/* The Scrolling Ribbon Track */}
        <div 
          ref={trackRef}
          className="ribbon-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '120px',
            paddingLeft: '40vw', // Start cards further to the right
            paddingRight: '20vw',
            width: 'max-content',
            perspective: '1500px',
            marginTop: '10vh'
          }}
        >
          {featuredProjects.map((project, i) => (
            <div
              key={project.slug}
              className="ribbon-card"
              style={{
                width: '450px',
                height: '600px',
                flexShrink: 0,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="card project-3d-card"
                style={{ 
                  textDecoration: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%', 
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  boxShadow: '0 40px 80px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '36px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={prefersReducedMotion() ? {} : { 
                  scale: 1.03, 
                  borderColor: 'rgba(192, 132, 252, 0.5)',
                  y: -10,
                  boxShadow: '0 50px 100px -20px rgba(192, 132, 252, 0.2)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Decorative neon glow line */}
                <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(192, 132, 252, 0.8), transparent)' }} />
                
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    gap: '12px',
                  }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{project.title}</h3>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#c084fc',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      background: 'rgba(192, 132, 252, 0.1)',
                      border: '1px solid rgba(192, 132, 252, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      flexShrink: 0,
                    }}>
                      {project.category}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    marginBottom: '24px',
                  }}>
                    <div style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Problem: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{project.problem}</span>
                    </div>
                    <div style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Approach: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{project.approach}</span>
                    </div>
                    <div style={{ fontSize: '15px', lineHeight: 1.6, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>Result: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{project.result}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 'auto' }}>
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span key={tech} className="pill" style={{ 
                      fontSize: '12px', 
                      padding: '8px 14px', 
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'var(--text-secondary)',
                      borderRadius: '16px',
                      fontWeight: 500
                    }}>
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 5 && (
                    <span className="pill" style={{ fontSize: '12px', padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', fontWeight: 500 }}>
                      +{project.techStack.length - 5}
                    </span>
                  )}
                </div>
              </motion.a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
