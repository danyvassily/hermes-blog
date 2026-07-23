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

  // Ouverture animée — pattern du skill architecte-dev
  useGSAP(() => {
    if (!post) return;
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(
        panelRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  // Fermeture animée
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { opacity: 0, y: 40, scale: 0.97, duration: 0.3, ease: 'power2.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, '-=0.1');
  };

  // ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!post) return null;

  const mainMedia = post.media[0];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      style={{ opacity: 0 }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-zinc-950 shadow-2xl"
        style={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-black/40 hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media banner */}
        {mainMedia && (
          <div
            className="relative h-56 md:h-72 overflow-hidden bg-cover bg-center rounded-t-3xl"
            style={{ backgroundImage: `url(${mainMedia.url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Category & date */}
          <div className="flex items-center gap-3">
            {post.category && (
              <span className="text-[11px] tracking-[0.15em] text-white/30 uppercase">
                {post.category}
              </span>
            )}
            <span className="h-3 w-px bg-white/[0.08]" />
            <time className="text-xs tracking-widest text-white/25 uppercase">
              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>

          <h2 className="text-2xl md:text-4xl font-light text-white leading-tight">
            {post.title}
          </h2>

          <div className="text-sm text-white/60 leading-relaxed space-y-4 whitespace-pre-line">
            {post.content}
          </div>

          {/* Tags */}
          {extractTags(post).length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-6">
              {extractTags(post).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/25"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
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
