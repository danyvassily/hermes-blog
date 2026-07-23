'use client';

import { useRef, useEffect, useState } from 'react';
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
  const [visible, setVisible] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  // Animate in when post becomes non-null
  useGSAP(() => {
    if (!post) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    });

    return () => ctx.revert();
  }, [post]);

  const close = () => {
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }
    gsap.to(panelRef.current, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      delay: 0.05,
      onComplete: () => {
        setVisible(false);
        onClose();
      },
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (post) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post]);

  if (!post && !visible) return null;

  const mainMedia = post?.media[0];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      {/* Sticky masthead */}
      <div className="sticky top-0 z-20 flex items-center justify-center border-b border-white/[0.06] bg-black/85 backdrop-blur-md px-8 py-[18px]">
        <span className="text-[13px] font-light tracking-[0.15em] uppercase text-white/80">
          Hermès Journal
        </span>
        <button
          onClick={close}
          className="absolute right-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] hover:bg-white/5 transition-colors"
          aria-label="Fermer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/40">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Article */}
      <div ref={panelRef} className="mx-auto max-w-[65ch] px-7 py-16 pb-24">
        {/* Category & date */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/30">
            {post?.category || 'Récit'}
          </span>
          {post && (
            <>
              <span className="h-3 w-px bg-white/[0.08]" />
              <time className="text-[11px] tracking-wider text-white/20 uppercase">
                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-12 text-[clamp(36px,5vw,48px)] font-light leading-[1.05] tracking-[-0.02em] text-white">
          {post?.title}
        </h1>

        {/* Hero figure */}
        {mainMedia && (
          <div className="mb-12 aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-900">
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
        <div className="space-y-6 text-[17px] leading-[1.7] text-white/80">
          {post?.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {post && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/[0.06] pt-8">
            {extractTags(post).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] py-6 flex items-center justify-center">
        <span className="text-[11px] tracking-[0.04em] text-white/30">
          Hermès Journal © 2026
        </span>
      </div>
    </div>
  );
}

function extractTags(post: BlogPost): string[] {
  const tags: string[] = [];
  const match = post.content.match(/#(\w[\w-]*)/g);
  if (match) {
    for (const t of match) {
      const tag = t.slice(1).toLowerCase();
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return tags;
}
