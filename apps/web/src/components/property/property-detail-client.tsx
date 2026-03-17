'use client';

import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '@/lib/api';
import { PropertyGallery } from './property-gallery';
import { PropertyDetails } from './property-details';
import { PropertyMap } from './property-map';
import { ContactForm } from './contact-form';
import { MortgageCalculator } from './mortgage-calculator';
import { SimilarProperties } from './similar-properties';
import { PropertyBreadcrumb } from './property-breadcrumb';
import { PropertyCardSkeleton } from './property-card-skeleton';

export function PropertyDetailClient({ slug }: { slug: string }) {
  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => listingsApi.getBySlug(slug).then((r) => r.data),
    enabled: !!process.env.NEXT_PUBLIC_API_URL,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[16/9] bg-gray-200 rounded-2xl animate-pulse" />
            <PropertyCardSkeleton />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h1>
        <p className="text-gray-500">
          {process.env.NEXT_PUBLIC_API_URL
            ? 'This listing may have been removed or the URL is incorrect.'
            : 'No API connected — set NEXT_PUBLIC_API_URL to load live listings.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PropertyBreadcrumb listing={listing} />
      <div className="grid lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-8">
          <PropertyGallery media={listing.media} title={listing.title} />
          <PropertyDetails listing={listing} />
          <PropertyMap location={listing.location} />
          <SimilarProperties listingId={listing.id} />
        </div>
        <div className="space-y-6">
          <ContactForm listing={listing} />
          <MortgageCalculator price={listing.price} currency={listing.currency} />
        </div>
      </div>
    </div>
  );
}
