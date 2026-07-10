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

  // ─── Preloader complete ───
  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // ─── New post handler ───
  const handlePostCreated = useCallback(
    (post: BlogPost) => {
      addPost(post);

      setTimeout(() => {
        const feed = document.getElementById('feed');
        feed?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    },
    [addPost]
  );

  // ─── Footer animation ───
  useGSAP(() => {
    if (loading) return;
    gsap.from('.footer-content', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-content',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
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

        <footer className="border-t border-white/[0.04] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="footer-content flex flex-col items-center justify-between gap-8 md:flex-row">
              <div>
                <p className="text-lg font-light tracking-[0.2em] text-white/60">
                  HERMÈS
                </p>
                <p className="mt-2 text-xs text-white/20">
                  Messager des Idées — Blog Nouvelle Génération
                </p>
              </div>
              <div className="flex items-center gap-6 text-xs text-white/20">
                <span>© {new Date().getFullYear()}</span>
                <span className="h-3 w-px bg-white/[0.06]" />
                <span>Next.js + GSAP</span>
                <span className="h-3 w-px bg-white/[0.06]" />
                <span>Propulsé par Hermes Agent</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
