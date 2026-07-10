'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/cn';
import type { MediaItem } from '@/types';

interface UploadZoneProps {
  onFilesSelected: (items: MediaItem[]) => void;
}

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<MediaItem[]>([]);

  // Entry animation
  useGSAP(() => {
    gsap.from(zoneRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: zoneRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  const pulseIcon = useCallback(() => {
    gsap.fromTo(
      iconRef.current,
      { scale: 1 },
      { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (files: FileList) => {
      const items: MediaItem[] = [];
      const previewUrls: MediaItem[] = [];

      Array.from(files).forEach((file) => {
        const id = `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');

        previewUrls.push({
          id,
          type: isVideo ? 'video' : 'image',
          url,
          alt: file.name,
        });

        items.push({
          id,
          type: isVideo ? 'video' : 'image',
          url,
          alt: file.name,
        });
      });

      setPreviews((prev) => [...prev, ...previewUrls]);
      onFilesSelected(items);
      pulseIcon();
    },
    [onFilesSelected, pulseIcon]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        processFiles(target.files);
      }
    };
    input.click();
  }, [processFiles]);

  const removePreview = useCallback((id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={zoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors',
          isDragging
            ? 'border-white/40 bg-white/5'
            : 'border-white/[0.08] bg-zinc-900/30 hover:border-white/20 hover:bg-zinc-900/50'
        )}
      >
        <div
          ref={iconRef}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white/60"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-sm text-white/40">
          {isDragging
            ? 'Déposez vos fichiers ici'
            : 'Glissez-déposez ou cliquez pour ajouter'}
        </p>
        <p className="mt-1 text-xs text-white/20">Images &amp; Vidéos</p>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((item) => (
            <div key={item.id} className="group relative h-16 w-16 overflow-hidden rounded-lg">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.alt ?? ''}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(item.id);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
