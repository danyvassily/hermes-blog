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

  return (
    <>
      <section ref={sectionRef} className="relative px-6 py-24 pb-32 md:px-12 md:pb-40">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm text-white/20">Aucun article pour l&apos;instant</p>
            </div>
          ) : (
            <div className="grid auto-rows-[300px] gap-5 md:grid-cols-2 lg:grid-cols-3">
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
