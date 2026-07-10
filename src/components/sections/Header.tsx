'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/cn';

export function Header() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const badge = badgeRef.current;
    const indicator = scrollIndicatorRef.current;
    const particles = particlesRef.current;

    if (!title || !subtitle || !badge || !indicator || !particles) return;

    const tl = gsap.timeline({ delay: 3.5 }); // After preloader

    // Badge appear
    tl.fromTo(badge, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      // Title stagger letters effect via character split
      .fromTo(
        title.querySelectorAll('.char'),
        { y: 100, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.03, ease: 'power4.out' },
        '-=0.4'
      )
      // Subtitle
      .fromTo(
        subtitle,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      // Scroll indicator
      .fromTo(indicator, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');

    // Floating particles animation
    gsap.to(particles.querySelectorAll('.particle'), {
      y: -40,
      opacity: 0,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
      delay: 4,
    });

    // Parallax on scroll
    gsap.to(sectionRef.current, {
      yPercent: 20,
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }, []);

  // Split title into characters
  const titleText = 'HERMÈS';
  const chars = titleText.split('').map((char, i) => (
    <span
      key={i}
      className="char inline-block"
      style={{ opacity: 0 }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'particle absolute h-[2px] w-[2px] rounded-full bg-white/20',
              i % 2 === 0 ? 'h-[3px] w-[3px] bg-white/10' : ''
            )}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-8 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-white/40"
          style={{ opacity: 0 }}
        >
          Blog nouvelle génération
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-[clamp(3rem,12vw,8rem)] font-light tracking-[0.08em] text-white leading-none"
        >
          {chars}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 max-w-xl text-sm leading-relaxed text-white/30 tracking-wide"
          style={{ opacity: 0 }}
        >
          L'art du message à l'ère numérique —{' '}
          <span className="text-white/50">où chaque idée trouve sa voix</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Défilez
        </span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
