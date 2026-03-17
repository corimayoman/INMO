import { Metadata } from 'next';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertyDetails } from '@/components/property/property-details';
import { PropertyMap } from '@/components/property/property-map';
import { ContactForm } from '@/components/property/contact-form';
import { MortgageCalculator } from '@/components/property/mortgage-calculator';
import { SimilarProperties } from '@/components/property/similar-properties';
import { PropertyBreadcrumb } from '@/components/property/property-breadcrumb';
import { PropertyDetailClient } from '@/components/property/property-detail-client';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // At build time we have no live data — return empty array.
  // Pages will be generated client-side via the client component below.
  return [];
}

// Must be false for static export (output: 'export')
export const dynamicParams = false;

export const metadata: Metadata = {
  title: 'Property Details | WorldPropertyFinder',
  description: 'View full property details, photos, and contact the agent.',
};

export default function PropertyPage({ params }: { params: { slug: string } }) {
  return <PropertyDetailClient slug={params.slug} />;
}
