'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  media: any[];
  title: string;
}

export function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const images = media?.filter((m) => m.type === 'IMAGE') || [];
  const videos = media?.filter((m) => m.type === 'VIDEO') || [];

  if (!images.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
        <img src={images[current].url} alt={`${title} - photo ${current + 1}`} className="w-full h-full object-cover" />

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <button onClick={() => setLightbox(true)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
          <Expand className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn('shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors', i === current ? 'border-brand-600' : 'border-transparent')}
            >
              <img src={img.thumbnailUrl || img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {videos.length > 0 && (
            <button className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 border-transparent bg-gray-900 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={images[current].url} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <ChevronRight className="w-6 h-6" />
          </button>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">×</button>
        </div>
      )}
    </div>
  );
}
