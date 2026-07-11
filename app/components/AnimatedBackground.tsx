export function AnimatedBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      {/* Blue Orb */}
      <div 
        className="animate-float"
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background: 'radial-gradient(circle, rgba(45,172,249,0.15) 0%, rgba(0,0,0,0) 70%)',
          animationDuration: '10s',
          filter: 'blur(40px)'
        }} 
      />
      
      {/* Pink Orb */}
      <div 
        className="animate-float delay-500"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'radial-gradient(circle, rgba(250,115,218,0.1) 0%, rgba(0,0,0,0) 70%)',
          animationDuration: '14s',
          animationDirection: 'reverse',
          filter: 'blur(50px)'
        }} 
      />

      {/* Grid Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
    </div>
  );
}
