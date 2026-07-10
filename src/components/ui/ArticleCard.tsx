'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/cn';
import type { BlogPost } from '@/types';

interface ArticleCardProps {
  post: BlogPost;
  index: number;
  onClick: (post: BlogPost) => void;
}

export function ArticleCard({ post, index, onClick }: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // Entry animation
    gsap.from(card, {
      y: 80,
      opacity: 0,
      duration: 1,
      delay: index * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Parallax on image on scroll
    gsap.to(imageRef.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }, [index]);

  // Hover handlers via GSAP (not CSS — GSAP for smoother)
  const handleMouseEnter = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
    }
  };

  const mainMedia = post.media[0];

  return (
    <article
      ref={cardRef}
      onClick={() => onClick(post)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/[0.06]',
        'bg-zinc-900/40 backdrop-blur-sm',
        'cursor-pointer',
        index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : '',
        index % 3 === 1 ? 'md:col-span-1 md:row-span-1' : '',
        index % 3 === 2 ? 'md:col-span-1 md:row-span-1' : ''
      )}
    >
      {/* Media Container */}
      <div className="relative h-full min-h-[280px] overflow-hidden">
        {mainMedia?.type === 'video' ? (
          <video
            src={mainMedia.url}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            ref={imageRef}
            className="absolute inset-0 h-[120%] w-full bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: mainMedia
                ? `url(${mainMedia.url})`
                : undefined,
            }}
          />
        )}

        {/* Overlay gradient */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <time className="text-xs tracking-widest text-white/40 uppercase">
            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <h2 className="mt-2 text-xl md:text-2xl font-medium text-white leading-tight">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm text-white/50 leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}
