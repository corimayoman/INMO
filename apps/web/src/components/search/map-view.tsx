'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatPrice } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapViewProps {
  listings: any[];
  onBoundsChange?: (bbox: [number, number, number, number]) => void;
}

export function MapView({ listings, onBoundsChange }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 2,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (onBoundsChange) {
      map.current.on('moveend', () => {
        const bounds = map.current!.getBounds();
        if (bounds) {
          onBoundsChange([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
        }
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    if (!listings.length) return;

    const bounds = new mapboxgl.LngLatBounds();

    listings.forEach((listing) => {
      const { latitude, longitude } = listing.location || {};
      if (!latitude || !longitude) return;

      const el = document.createElement('div');
      el.className = 'map-marker';
      el.innerHTML = `<div class="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg cursor-pointer hover:bg-brand-700 transition-colors whitespace-nowrap">${formatPrice(listing.price, listing.currency)}</div>`;
      el.addEventListener('click', () => setSelectedListing(listing));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      markers.current.push(marker);
      bounds.extend([longitude, latitude]);
    });

    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    }
  }, [listings]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Selected listing popup */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-sm">
          <button onClick={() => setSelectedListing(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          <div className="flex gap-3">
            {selectedListing.media?.[0]?.url && (
              <img src={selectedListing.media[0].url} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0" />
            )}
            <div className="min-w-0">
              <div className="font-bold text-brand-700">{formatPrice(selectedListing.price, selectedListing.currency)}</div>
              <div className="text-sm text-gray-700 truncate">{selectedListing.title}</div>
              <a href={`/property?slug=${selectedListing.slug}`} className="text-xs text-brand-600 hover:underline mt-1 block">View details →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
