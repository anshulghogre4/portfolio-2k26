import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface BlurTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  elementType?: keyof JSX.IntrinsicElements;
}

export function BlurTextReveal({ 
  text, 
  className = '', 
  delay = 0,
  elementType: Element = 'div' 
}: BlurTextRevealProps) {
  const textRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    // Create a new instance of SplitText
    const split = new SplitText(textRef.current, { 
      type: "words,chars",
      charsClass: "blur-char" 
    });

    // Animate the characters
    gsap.fromTo(split.chars, 
      {
        opacity: 0,
        filter: 'blur(12px)',
        scale: 1.2,
        y: 20
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.03,
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        onComplete: () => {
          // Clean up filter for performance
          gsap.set(split.chars, { clearProps: "filter,will-change" });
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* @ts-ignore */}
      <Element ref={textRef} className={className}>
        {text}
      </Element>
    </div>
  );
}
