import type { ReactNode } from 'react';

interface TerminalBlockProps {
  children: ReactNode;
  className?: string;
}

export function TerminalBlock({ children, className = '' }: TerminalBlockProps) {
  return (
    <div 
      className={`terminal-block ${className}`}
      style={{
        background: 'rgba(5, 8, 16, 0.82)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}
    >
      {/* Title Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
      </div>
      
      {/* Content */}
      <div 
        style={{
          padding: '20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'var(--color-text)',
          overflowX: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}
