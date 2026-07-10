'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function Header() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const title = titleRef.current;
    if (!title) return;

    const tl = gsap.timeline({ delay: 3.5 });
    tl.fromTo(
      title.querySelectorAll('.char'),
      { y: 60, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.04, ease: 'power4.out' }
    );

    // Subtle parallax on scroll
    gsap.to(sectionRef.current, {
      yPercent: 15,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }, []);

  const titleText = 'Hermès';
  const chars = titleText.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ opacity: 0 }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle grain texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          ref={titleRef}
          className="text-[clamp(48px,10vw,96px)] font-light tracking-[0.08em] text-white leading-none"
        >
          {chars}
        </h1>
        <p className="mt-4 text-xs text-white/25 tracking-[0.3em] uppercase">
          Messager des Idées
        </p>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] text-white/15 uppercase">
          Défilez
        </span>
        <div className="h-6 w-[1px] bg-gradient-to-b from-white/15 to-transparent" />
      </div>
    </section>
  );
}
