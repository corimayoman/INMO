'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyDetailClient } from '@/components/property/property-detail-client';

function PropertyPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';
  return <PropertyDetailClient slug={slug} />;
}

export default function PropertyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading property...</div>}>
      <PropertyPageInner />
    </Suspense>
  );
}
