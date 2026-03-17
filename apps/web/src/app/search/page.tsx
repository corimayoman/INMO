'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { listingsApi } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyCardSkeleton } from '@/components/property/property-card-skeleton';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchHeader } from '@/components/search/search-header';
import { MapView } from '@/components/search/map-view';
import { Pagination } from '@/components/ui/pagination';
import { LayoutList, Map, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'map' | 'split';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [page, setPage] = useState(1);

  const filters = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useQuery({
    queryKey: ['search', filters, page],
    queryFn: () => listingsApi.search({ ...filters, page }).then((r) => r.data),
    keepPreviousData: true,
  });

  const listings = data?.listings || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <SearchHeader filters={filters} total={total} />

      <div className="flex flex-1 overflow-hidden">
        {/* Filters sidebar */}
        <aside className="hidden lg:block w-72 xl:w-80 border-r border-gray-100 overflow-y-auto shrink-0">
          <SearchFilters />
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View mode toggle */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
            <span className="text-sm text-gray-500">
              {isLoading ? 'Searching...' : `${total.toLocaleString()} properties found`}
            </span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {([['list', LayoutList], ['split', Columns], ['map', Map]] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    viewMode === mode ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className={cn('flex-1 overflow-hidden', viewMode === 'split' && 'flex')}>
            {/* List view */}
            {(viewMode === 'list' || viewMode === 'split') && (
              <div className={cn('overflow-y-auto', viewMode === 'split' ? 'w-1/2 border-r border-gray-100' : 'w-full')}>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {isLoading
                    ? Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                    : listings.map((listing: any) => <PropertyCard key={listing.id} listing={listing} />)}
                </div>
                {!isLoading && listings.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="p-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                )}
              </div>
            )}

            {/* Map view */}
            {(viewMode === 'map' || viewMode === 'split') && (
              <div className={cn(viewMode === 'split' ? 'w-1/2' : 'w-full h-full')}>
                <MapView listings={listings} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
