import { useState, useEffect } from 'react';
import { audio } from '../lib/audio';
import { Volume2, VolumeX } from 'lucide-react'; // Make sure lucide-react is installed

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(audio.isMuted);
  }, []);

  const toggleSound = async () => {
    if (isMuted) {
      await audio.unmute();
      setIsMuted(false);
    } else {
      audio.mute();
      setIsMuted(true);
    }
  };

  return (
    <button
      onClick={toggleSound}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '9999px',
        backgroundColor: isMuted ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
        padding: '12px',
        fontSize: '14px',
        fontWeight: 500,
        color: isMuted ? 'rgba(255,255,255,0.7)' : '#ffffff',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.2s',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      <span style={{ display: 'inline-block' }}>
        {isMuted ? 'Sound Off' : 'Sound On'}
      </span>
    </button>
  );
}
