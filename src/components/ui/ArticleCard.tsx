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

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  }, [index]);

  const mainMedia = post.media[0];
  const tags = extractTags(post);

  return (
    <article
      ref={cardRef}
      onClick={() => onClick(post)}
      className={cn(
        'group cursor-pointer rounded-2xl border border-white/[0.06]',
        'bg-zinc-900/30 backdrop-blur-sm',
        'transition-all duration-300 hover:border-white/[0.12] hover:bg-zinc-900/50',
        'flex flex-col md:flex-row gap-6 p-6 md:p-8'
      )}
    >
      {/* Media thumbnail */}
      {mainMedia && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl md:h-44 md:w-56">
          {mainMedia.type === 'video' ? (
            <video
              src={mainMedia.url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${mainMedia.url})` }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
            {post.category || 'RECHERCHES'}
          </span>
          <span className="h-3 w-px bg-white/[0.08]" />
          <time className="text-[10px] tracking-wider text-white/20 uppercase">
            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>

        <h2 className="text-lg md:text-xl font-medium text-white leading-snug group-hover:text-white/90 transition-colors">
          {post.title}
        </h2>

        <p className="mt-3 text-sm text-white/45 leading-relaxed line-clamp-4 md:line-clamp-3">
          {post.content}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-[10px] text-white/25"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/** Extract hashtags from content */
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
