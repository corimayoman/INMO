'use client';

import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { favoritesApi } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyCardSkeleton } from '@/components/property/property-card-skeleton';

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getAll().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-brand-600" />
        <h1 className="text-2xl font-bold text-gray-900">Saved properties</h1>
        {data?.length > 0 && <span className="badge-blue">{data.length}</span>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((fav: any) => <PropertyCard key={fav.id} listing={fav.listing} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No saved properties yet</h2>
          <p className="text-gray-500 mb-6">Start exploring and save properties you love</p>
          <Link href="/search" className="btn-primary">Browse properties</Link>
        </div>
      )}
    </div>
  );
}
