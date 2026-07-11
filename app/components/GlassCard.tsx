import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = '', hoverEffect = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hoverEffect ? 'hover-effect' : ''} ${className}`}
      style={{
        background: 'var(--color-surface)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: 'var(--glass-border)',
        borderRadius: 'var(--glass-radius)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}
