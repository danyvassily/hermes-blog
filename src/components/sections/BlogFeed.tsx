'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
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
    if (!sectionRef.current) return;
    gsap.from('.feed-header', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.feed-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative px-6 py-24 pb-32 md:px-12 md:pb-40">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="feed-header mb-16">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                Tous les articles
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
              Le flux{' '}
              <span className="text-white/30">complet</span>
            </h2>
            <p className="mt-3 text-sm text-white/25">
              {posts.length} article{posts.length > 1 ? 's' : ''} publié{posts.length > 1 ? 's' : ''}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm text-white/20">Aucun article pour l&apos;instant</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
