'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ArticleModal } from '@/components/ui/ArticleModal';
import type { BlogPost } from '@/types';

interface BlogFeedProps {
  posts: BlogPost[];
}

export function BlogFeed({ posts }: BlogFeedProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleOpen = useCallback((post: BlogPost) => setSelectedPost(post), []);
  const handleClose = useCallback(() => setSelectedPost(null), []);

  useGSAP(() => {
    const counterEl = sectionRef.current?.querySelector('.post-counter');
    if (!counterEl) return;

    gsap.from(counterEl, {
      textContent: 0,
      duration: 1.5,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: counterEl,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, [posts.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative px-6 pb-32 md:px-12 md:pb-48"
      >
        <ScrollReveal>
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                Flux
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                Articles
              </h2>
              <span className="post-counter text-lg text-white/20 tabular-nums">
                {posts.length}
              </span>
            </div>
            <p className="mt-4 text-sm text-white/30 leading-relaxed max-w-lg">
              Une collection de messages, d&apos;images et d&apos;idées qui traversent le temps.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 max-w-7xl">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/20"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="13" x2="13" y2="13" />
                </svg>
              </div>
              <p className="text-sm text-white/20">Aucun article pour l&apos;instant</p>
              <p className="mt-1 text-xs text-white/10">
                Publiez votre premier message ci-dessus
              </p>
            </div>
          ) : (
            <div className="grid auto-rows-[280px] gap-4 md:grid-cols-3 md:grid-rows-[auto]">
              {posts.map((post, index) => (
                <ArticleCard key={post.id} post={post} index={index} onClick={handleOpen} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ArticleModal post={selectedPost} onClose={handleClose} />
    </>
  );
}
