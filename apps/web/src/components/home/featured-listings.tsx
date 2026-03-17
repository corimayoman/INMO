'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { listingsApi } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyCardSkeleton } from '@/components/property/property-card-skeleton';

export function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => listingsApi.search({ isFeatured: true, limit: 6 }).then((r) => r.data),
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-title">Featured Properties</h2>
          <p className="text-gray-500 mt-1">Hand-picked premium listings from around the world</p>
        </div>
        <Link href="/search?isFeatured=true" className="btn-secondary text-sm hidden sm:flex">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : data?.listings?.map((listing: any) => <PropertyCard key={listing.id} listing={listing} />)}
      </div>
    </section>
  );
}
