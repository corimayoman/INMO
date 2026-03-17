'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export function PropertyMap({ location }: { location: any }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !location?.latitude || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [location.longitude, location.latitude],
      zoom: 14,
    });

    new mapboxgl.Marker({ color: '#0070c4' })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map.current);

    return () => { map.current?.remove(); map.current = null; };
  }, [location]);

  if (!location?.latitude) return null;

  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
      <div ref={mapContainer} className="w-full h-64 rounded-xl overflow-hidden" />
      <p className="text-xs text-gray-400 mt-2">Approximate location shown for privacy</p>
    </div>
  );
}
