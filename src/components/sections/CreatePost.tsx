'use client';

import { useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { UploadZone } from '@/components/ui/UploadZone';
import { TextEditor } from '@/components/ui/TextEditor';
import type { BlogPost, MediaItem } from '@/types';

interface CreatePostProps {
  onPostCreated: (post: BlogPost) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleFiles = useCallback((items: MediaItem[]) => {
    setMedia((prev) => [...prev, ...items]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    // Simulate creation delay
    await new Promise((r) => setTimeout(r, 600));

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      media,
      createdAt: new Date(),
    };

    onPostCreated(newPost);
    setTitle('');
    setContent('');
    setMedia([]);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Animate success
    if (successRef.current) {
      gsap.fromTo(
        successRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }

    setTimeout(() => setShowSuccess(false), 3000);
  }, [title, content, media, onPostCreated]);

  return (
    <section className="relative px-6 py-32 md:px-12 md:py-48">
      {/* Section label */}
      <ScrollReveal>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-white/20" />
            <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Création
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
            Partager{' '}
            <span className="text-white/40">une idée</span>
          </h2>
          <p className="mt-4 text-sm text-white/30 leading-relaxed max-w-lg">
            Déposez vos médias et composez votre message. Chaque publication rejoint le flux.
          </p>
        </div>
      </ScrollReveal>

      {/* Form */}
      <ScrollReveal direction="up" distance={40}>
        <div
          ref={formRef}
          className="mx-auto mt-16 max-w-3xl space-y-6"
        >
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="w-full border-b border-white/[0.06] bg-transparent pb-3 text-xl text-white/80 placeholder:text-white/20 outline-none transition-colors focus:border-white/20"
          />

          {/* Upload zone */}
          <UploadZone onFilesSelected={handleFiles} />

          {/* Text editor */}
          <TextEditor
            value={content}
            onChange={setContent}
            placeholder="Écrivez votre message..."
          />

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="group relative overflow-hidden rounded-full border border-white/[0.12] px-8 py-3 text-sm text-white/70 transition-all duration-300 hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                    Publication...
                  </>
                ) : (
                  <>
                    Publier
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            {/* Success message */}
            {showSuccess && (
              <div
                ref={successRef}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Publié dans le flux
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
