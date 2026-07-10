'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // Text reveal
    tl.fromTo(
      textRef.current,
      { y: 40, opacity: 0, rotateX: 30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'power3.out' }
    )
      // Loading bar
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.2, ease: 'power2.inOut' },
        '-=0.4'
      )
      // Pause then fade out
      .to(container.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: 0.3,
      });
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <h1
        ref={textRef}
        className="text-6xl md:text-8xl font-light tracking-[0.3em] text-white/90"
        style={{ opacity: 0 }}
      >
        HERMÈS
      </h1>
      <p className="mt-4 text-xs tracking-[0.5em] text-white/30 uppercase">
        Messager des Idées
      </p>
      <div className="mt-12 h-[1px] w-40 overflow-hidden bg-white/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-white/60"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
