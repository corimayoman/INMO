'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const propertyTypes = ['APARTMENT', 'HOUSE', 'VILLA', 'TOWNHOUSE', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT', 'OFFICE', 'LAND'];
const bedroomOptions = [1, 2, 3, 4, 5];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4 px-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3">
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(Object.fromEntries(searchParams.entries()));

  const set = (key: string, value: any) => setLocalFilters((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: string) => setLocalFilters((prev) => {
    const next = { ...prev };
    if (next[key] === 'true') { delete next[key]; } else { next[key] = 'true'; }
    return next;
  });

  const applyFilters = () => {
    const clean = Object.fromEntries(Object.entries(localFilters).filter(([, v]) => v !== undefined && v !== ''));
    router.push(`/search?${new URLSearchParams(clean as any).toString()}`);
  };

  const resetFilters = () => {
    setLocalFilters({});
    router.push('/search');
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-sm text-gray-900">Filters</span>
        <button onClick={resetFilters} className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />Reset
        </button>
      </div>

      <FilterSection title="Listing type">
        <div className="grid grid-cols-2 gap-2">
          {[['SALE', 'For Sale'], ['RENT', 'For Rent'], ['SHORT_TERM', 'Short-term'], ['COMMERCIAL', 'Commercial']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => set('listingType', val)}
              className={cn('px-3 py-2 text-xs rounded-lg border transition-colors', localFilters.listingType === val ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300')}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Property type">
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => set('propertyType', type)}
              className={cn('px-3 py-1.5 text-xs rounded-full border transition-colors', localFilters.propertyType === type ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300')}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price range">
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={localFilters.priceMin || ''} onChange={(e) => set('priceMin', e.target.value)} className="input text-xs" />
          <input type="number" placeholder="Max" value={localFilters.priceMax || ''} onChange={(e) => set('priceMax', e.target.value)} className="input text-xs" />
        </div>
      </FilterSection>

      <FilterSection title="Bedrooms">
        <div className="flex gap-2">
          <button onClick={() => set('bedroomsMin', undefined)} className={cn('px-3 py-1.5 text-xs rounded-lg border', !localFilters.bedroomsMin ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600')}>Any</button>
          {bedroomOptions.map((n) => (
            <button key={n} onClick={() => set('bedroomsMin', String(n))} className={cn('px-3 py-1.5 text-xs rounded-lg border', localFilters.bedroomsMin === String(n) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600')}>
              {n}+
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Features" defaultOpen={false}>
        <div className="space-y-2">
          {[['hasPool', 'Pool'], ['hasGarden', 'Garden'], ['hasTerrace', 'Terrace'], ['hasBalcony', 'Balcony'], ['hasElevator', 'Elevator'], ['hasParking', 'Parking'], ['hasAirConditioning', 'Air conditioning'], ['isPetFriendly', 'Pet friendly']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={localFilters[key] === 'true'} onChange={() => toggle(key)} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="p-4">
        <button onClick={applyFilters} className="btn-primary w-full">Apply filters</button>
      </div>
    </div>
  );
}
