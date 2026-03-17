'use client';

import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface SearchHeaderProps {
  filters: Record<string, string>;
  total: number;
}

export function SearchHeader({ filters, total }: SearchHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ ...filters, q: query });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, neighborhood, address..."
            className="input pl-9"
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>
    </div>
  );
}
