export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      padding: '48px 0',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
        }}>
          Graduate of{' '}
          <a
            href="https://fde.academy"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent-blue)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            FDE Academy's
          </a>
          {' '}Forward Deployed Engineering & Applied AI program
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            © {year} Anshul Ghogre
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'GitHub', url: 'https://github.com/anshulghogre4' },
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/anshulg4/' },
              { label: 'X', url: 'https://twitter.com/anshulghogre4' },
              { label: 'Blog', url: 'https://hashnode.com/@Mrghogre' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-tertiary)',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
