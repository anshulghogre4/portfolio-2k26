import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Work', href: '#work' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <style>{`
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }
        .desktop-nav {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 16px 24px;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          .mobile-menu.open { display: flex; }
        }
      `}</style>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container nav-container">
          {/* Logo */}
          <a
            href="#"
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              textDecoration: 'none'
            }}
          >
            Anshul Ghogre
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--text-tertiary)',
                  transition: 'color 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/Anshul_Resume_FDE.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '6px 14px',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Resume
            </a>
          </nav>

          {/* Mobile Toggle Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/Anshul_Resume_FDE.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            Resume
          </a>
        </div>
      </header>
    </>
  );
}
