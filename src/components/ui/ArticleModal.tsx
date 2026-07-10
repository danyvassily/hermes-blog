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
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!post || !overlayRef.current || !panelRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: 60, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    // Stop body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [post]);

  const handleClose = () => {
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, {
      opacity: 0,
      y: 40,
      scale: 0.97,
      duration: 0.3,
      ease: 'power2.in',
    }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.2 },
      '-=0.1'
    );
  };

  // ESC key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!post) return null;

  const mainMedia = post.media[0];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      style={{ opacity: 0 }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-zinc-950 shadow-2xl"
        style={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-md transition-colors hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media */}
        {mainMedia && (
          <div className="relative h-56 md:h-72 overflow-hidden">
            {mainMedia.type === 'video' ? (
              <video
                src={mainMedia.url}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : mainMedia.url.startsWith('/') || mainMedia.url.startsWith('http') ? (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${mainMedia.url})` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div ref={contentRef} className="p-6 md:p-8 space-y-6">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-white/30">
            <time className="tracking-widest uppercase">
              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {post.media.length > 1 && (
              <>
                <span className="h-3 w-px bg-white/[0.06]" />
                <span>+{post.media.length - 1} média{post.media.length - 1 > 1 ? 's' : ''}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-light text-white leading-tight tracking-tight">
            {post.title}
          </h2>

          {/* Body */}
          <div className="text-sm text-white/60 leading-relaxed space-y-4 whitespace-pre-line">
            {post.content}
          </div>

          {/* Additional media */}
          {post.media.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.media.slice(1).map((m) => (
                <div
                  key={m.id}
                  className="h-20 w-20 overflow-hidden rounded-xl border border-white/[0.04]"
                >
                  {m.type === 'video' ? (
                    <video src={m.url} className="h-full w-full object-cover" muted loop playsInline />
                  ) : (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${m.url})` }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
