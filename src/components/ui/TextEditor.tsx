'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/cn';

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function TextEditor({
  value,
  onChange,
  placeholder = 'Écrivez votre message...',
}: TextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      scale: 0.98,
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'border border-white/[0.06] bg-zinc-900/30',
        'transition-colors duration-300 focus-within:border-white/20'
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className={cn(
          'w-full resize-none bg-transparent px-5 py-4',
          'text-sm text-white/80 placeholder:text-white/20',
          'outline-none',
          'leading-relaxed'
        )}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-1">
        <span className="text-[10px] text-white/20 tabular-nums">
          {value.length} caractères
        </span>
      </div>
    </div>
  );
}
