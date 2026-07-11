export function Navbar() {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Work', href: '#work' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
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
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
      }}>
        {/* Logo */}
        <a
          href="#"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Anshul Ghogre
        </a>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--text-tertiary)',
                transition: 'color 0.2s ease',
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
      </div>
    </header>
  );
}
