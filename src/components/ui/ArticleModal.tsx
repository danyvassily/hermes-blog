'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import type { BlogPost } from '@/types';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export function ArticleModal({ post, onClose }: ArticleModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!post || !overlayRef.current || !panelRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );

    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  const close = () => {
    if (!overlayRef.current || !panelRef.current) { onClose(); return; }
    gsap.to(panelRef.current, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.15, delay: 0.05, onComplete: onClose });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!post) return null;

  const mainMedia = post.media[0];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm overflow-y-auto"
      style={{ opacity: 0 }}
    >
      {/* Sticky masthead */}
      <div className="sticky top-0 z-20 flex items-center justify-center border-b border-white/[0.06] bg-black/85 backdrop-blur-md px-8 py-[18px]">
        <span className="text-[13px] font-light tracking-[0.15em] uppercase text-white/80">
          Journal
        </span>
        <button
          onClick={close}
          className="absolute right-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] hover:bg-white/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/40">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Article */}
      <div ref={panelRef} className="mx-auto max-w-[65ch] px-7 py-16 pb-24" style={{ opacity: 0 }}>
        {/* Eyebrow */}
        <div className="mb-[18px] text-[11px] font-medium tracking-[0.08em] uppercase text-[oklch(58%_0.18_45)]">
          Récit
        </div>

        {/* Title */}
        <h1 className="mb-12 text-[clamp(36px,5vw,48px)] font-light leading-[1.05] tracking-[-0.02em] text-white">
          {post.title}
        </h1>

        {/* Hero figure */}
        {mainMedia && (
          <div className="mb-12 aspect-[16/9] overflow-hidden rounded-[4px] bg-[oklch(10%_0.01_50)]">
            {mainMedia.type === 'video' ? (
              <video src={mainMedia.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
            ) : (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${mainMedia.url})` }}
              />
            )}
          </div>
        )}

        {/* Body text */}
        <div className="space-y-6 text-[17px] leading-[1.65] text-white/85 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:text-[64px] [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:pr-[10px] [&>p:first-child]:first-letter:pt-1 [&>p:first-child]:first-letter:font-[300] [&>p:first-child]:first-letter:font-[family-name:var(--font-geist-sans)]">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] py-6 flex items-center justify-center">
        <span className="text-[11px] tracking-[0.04em] text-white/30">
          © 2026
        </span>
      </div>
    </div>
  );
}
