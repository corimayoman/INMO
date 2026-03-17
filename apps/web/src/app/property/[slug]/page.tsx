import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertyDetails } from '@/components/property/property-details';
import { PropertyMap } from '@/components/property/property-map';
import { ContactForm } from '@/components/property/contact-form';
import { MortgageCalculator } from '@/components/property/mortgage-calculator';
import { SimilarProperties } from '@/components/property/similar-properties';
import { PropertyBreadcrumb } from '@/components/property/property-breadcrumb';

async function getListing(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await getListing(params.slug);
  if (!listing) return { title: 'Property not found' };

  return {
    title: listing.title,
    description: listing.description?.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description?.substring(0, 160),
      images: listing.media?.[0]?.url ? [{ url: listing.media[0].url }] : [],
    },
  };
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const listing = await getListing(params.slug);
  if (!listing) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PropertyBreadcrumb listing={listing} />

      <div className="grid lg:grid-cols-3 gap-8 mt-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <PropertyGallery media={listing.media} title={listing.title} />
          <PropertyDetails listing={listing} />
          <PropertyMap location={listing.location} />
          <SimilarProperties listingId={listing.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ContactForm listing={listing} />
          <MortgageCalculator price={listing.price} currency={listing.currency} />
        </div>
      </div>
    </div>
  );
}
