'use client';

import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '@/lib/api';
import { PropertyCard } from './property-card';

export function SimilarProperties({ listingId }: { listingId: string }) {
  const { data } = useQuery({
    queryKey: ['similar', listingId],
    queryFn: () => listingsApi.getSimilar(listingId).then((r) => r.data),
  });

  if (!data?.length) return null;

  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-4">Similar properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((listing: any) => <PropertyCard key={listing.id} listing={listing} compact />)}
      </div>
    </div>
  );
}
