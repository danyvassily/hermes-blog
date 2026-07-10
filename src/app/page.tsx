'use client';

import { useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Preloader } from '@/components/ui/Preloader';
import { Header } from '@/components/sections/Header';
import { CreatePost } from '@/components/sections/CreatePost';
import { BlogFeed } from '@/components/sections/BlogFeed';
import { usePosts } from '@/lib/store';
import type { BlogPost } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const { posts, addPost } = usePosts();

  const handlePreloaderComplete = useCallback(() => setLoading(false), []);

  const handlePostCreated = useCallback(
    (post: BlogPost) => {
      addPost(post);
      setTimeout(() => {
        document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    },
    [addPost]
  );

  useGSAP(() => {
    if (loading) return;
    gsap.from('.footer-content', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-content', start: 'top 90%', toggleActions: 'play none none none' },
    });
  }, [loading]);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <main
        ref={mainRef}
        className={`relative transition-opacity duration-700 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Header />

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div id="feed">
          <BlogFeed posts={posts} />
        </div>

        <footer className="border-t border-white/[0.04] px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="footer-content flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-white/20 tracking-[0.15em] uppercase font-light">
                Hermès
              </p>
              <div className="flex items-center gap-4 text-[11px] text-white/20">
                <span>© 2026</span>
                <span className="h-3 w-px bg-white/[0.06]" />
                <span>Next.js + GSAP</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
