import type { Route } from "./+types/home";
import { profile } from "../data/profile";
import { skillCategories } from "../data/skills";
import { certifications, education } from "../data/certifications";
import { experiences } from "../data/experience";
import { featuredProjects } from "../data/projects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anshul Ghogre | Applied AI Engineer" },
    { name: "description", content: "Applied AI Engineer with an FDE mindset. RAG, Agentic Systems, Knowledge Graphs, MLOps." },
    { property: "og:title", content: "Anshul Ghogre — Applied AI Engineer" },
    { property: "og:description", content: "Building AI systems that survive contact with production." },
  ];
}

/* ─────────────────────────────────
   FULL SINGLE-PAGE PORTFOLIO
   Hero → About → Skills → Work → Projects → Contact
   ───────────────────────────────── */
export default function Home() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}


/* ═══════════════════════════════════
   1. HERO SECTION
   ═══════════════════════════════════ */
function HeroSection() {
  return (
    <section style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      padding: '80px 0',
    }}>
      <div
        className="container hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left: Text */}
        <div className="animate-fade-up">
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '24px',
          }}>
            {profile.roles.join(' · ')}
          </p>

          <h1 style={{ marginBottom: '24px' }}>
            {profile.tagline}
          </h1>

          <p style={{
            fontSize: '17px',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '580px',
          }}>
            {profile.heroStatement}
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="#projects"
              style={{
                padding: '12px 28px',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              View Projects
            </a>
            <a
              href="#contact"
              style={{
                padding: '12px 28px',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Get in Touch
            </a>
            <a
              href="/Anshul_Resume_FDE.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--border-subtle)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              📄 Download Resume
            </a>
          </div>
        </div>

        {/* Right: Profile Image */}
        <div className="animate-fade-up delay-2 hero-image-wrap" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* Abstract glowing background */}
          <div style={{
            position: 'absolute',
            width: '140%',
            height: '140%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.3) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(217, 70, 239, 0.3) 0%, transparent 60%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          {/* Glassmorphic Image Card (Golden Ratio-ish) */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1 / 1.25',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
            padding: '12px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}>
              <img 
                src="/images/Anshul_Ghogre.png" 
                alt="Anshul Ghogre" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════
   2. ABOUT / FDE MINDSET
   ═══════════════════════════════════ */
function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <p className="section-label">About</p>
        <h2 style={{ marginBottom: '24px' }}>The FDE Mindset</h2>
        <p style={{
          fontSize: '17px',
          lineHeight: 1.8,
          color: 'var(--text-secondary)',
          marginBottom: '64px',
          maxWidth: '720px',
        }}>
          {profile.fdePhilosophy}
        </p>

        {/* Four Pillars */}
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
              <p style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════
   3. SKILLS & CERTIFICATIONS
   ═══════════════════════════════════ */
function SkillsSection() {
  return (
    <section id="skills" className="section">
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
            <div key={cat.id}>
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
                  <span key={skill.name} className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
              className="card"
              style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              {/* Logo at top of card */}
              {cert.logo && (
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '10px',
                  background: cert.logoBg ?? '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '6px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  flexShrink: 0,
                }}>
                  <img
                    src={cert.logo}
                    alt={cert.code}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-blue)',
                marginBottom: '8px',
              }}>
                {cert.code}
              </p>
              <h4 style={{ fontSize: '15px', marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {cert.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.5, flex: 1 }}>
                {cert.description}
              </p>
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
              className="card"
              style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              {/* Top: badge image centered + cert code + badge chip */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', gap: '8px' }}>
                {/* Left: badge + code stacked */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Official Microsoft Certified badge */}
                  <img
                    src={
                      cert.badge === 'Expert'
                        ? 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-expert-badge.svg'
                        : 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg'
                    }
                    alt={`Microsoft Certified ${cert.badge}`}
                    style={{ width: '52px', height: '52px', objectFit: 'contain', flexShrink: 0, display: 'block' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0078D4',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}>
                    {cert.code}
                  </p>
                </div>
                {/* Right: badge chip */}
                {cert.badge && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 9px',
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
              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {cert.title}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.5,
                flex: 1,
              }}>
                {cert.description}
              </p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: '#0078D4', fontWeight: 500 }}>Verify on Microsoft Learn →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════
   4. WORK EXPERIENCE
   ═══════════════════════════════════ */
function WorkSection() {
  return (
    <section id="work" className="section">
      <div className="container">
        <p className="section-label">Experience</p>
        <h2 style={{ marginBottom: '64px' }}>Where I've Worked</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="card"
            >
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
    </section>
  );
}


/* ═══════════════════════════════════
   5. PERSONAL PROJECTS
   ═══════════════════════════════════ */
function ProjectsSection() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 style={{ marginBottom: '16px' }}>Featured Builds</h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '48px',
          maxWidth: '560px',
        }}>
          Personal projects where I apply the FDE mindset — real deployment friction,
          real data, real AI in production.
        </p>

        <div
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {featuredProjects.map((project) => (
            <a
              key={project.slug}
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '12px',
              }}>
                <h3 style={{ fontSize: '17px' }}>{project.title}</h3>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  flexShrink: 0,
                }}>
                  {project.category}
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Problem: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{project.problem}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Approach: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{project.approach}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Result: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{project.result}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.techStack.slice(0, 5).map((tech) => (
                  <span key={tech} className="pill" style={{ fontSize: '11px', padding: '3px 10px' }}>
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 5 && (
                  <span className="pill" style={{ fontSize: '11px', padding: '3px 10px' }}>
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════
   6. CONTACT
   ═══════════════════════════════════ */
function ContactSection() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <p className="section-label">Contact</p>
        <h2 style={{ marginBottom: '16px' }}>Let's Connect</h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '48px',
          maxWidth: '500px',
        }}>
          {profile.openTo} Feel free to reach out.
        </p>

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '640px',
          }}
        >
          <ContactCard label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactCard label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
          <ContactCard label="LinkedIn" value="/in/anshulg4" href={profile.linkedin} external />
          <ContactCard label="GitHub" value="@anshulghogre4" href={profile.github} external />
        </div>

        <p style={{
          marginTop: '48px',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)',
        }}>
          Based in {profile.location} · Open to remote opportunities
        </p>
      </div>
    </section>
  );
}

function ContactCard({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="card"
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '8px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-primary)',
        fontWeight: 500,
      }}>
        {value}
      </p>
    </a>
  );
}
