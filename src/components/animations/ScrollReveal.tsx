'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/cn';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  rotate?: number;
  scale?: number;
  scrub?: boolean | number;
  trigger?: React.RefObject<HTMLElement | null>;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 1.2,
  distance = 60,
  rotate = 0,
  scale = 1,
  scrub = false,
  once = true,
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration,
      ease: 'power3.out',
      delay,
    };

    if (direction === 'up') fromVars.y = distance;
    else if (direction === 'down') fromVars.y = -distance;
    else if (direction === 'left') fromVars.x = distance;
    else if (direction === 'right') fromVars.x = -distance;

    if (rotate !== 0) fromVars.rotation = rotate;
    if (scale !== 1) fromVars.scale = scale;

    if (scrub !== false) {
      gsap.from(el, {
        ...fromVars,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          scrub: typeof scrub === 'number' ? scrub : 1,
        },
      });
    } else {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      });
      tl.from(el, fromVars);
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && st.trigger === el) st.kill();
      });
    };
  }, [direction, delay, duration, distance, rotate, scale, scrub, once]);

  return (
    <div ref={container} className={cn(className)}>
      {children}
    </div>
  );
}
