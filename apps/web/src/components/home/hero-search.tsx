'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { aiApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const listingTypes = [
  { value: 'SALE', label: 'Buy' },
  { value: 'RENT', label: 'Rent' },
  { value: 'SHORT_TERM', label: 'Short-term' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'NEW_DEVELOPMENT', label: 'New Developments' },
];

export function HeroSearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState('SALE');
  const [query, setQuery] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (aiMode) {
      setLoading(true);
      try {
        const { data: filters } = await aiApi.parseSearch(query);
        const params = new URLSearchParams({ ...filters, q: query });
        router.push(`/search?${params.toString()}`);
      } catch {
        router.push(`/search?q=${encodeURIComponent(query)}&listingType=${listingType}`);
      } finally {
        setLoading(false);
      }
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}&listingType=${listingType}`);
    }
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800" />
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 to-transparent" />
      {/* Decorative pink glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Find Your Perfect Property
          <span className="block text-pink-300">Anywhere in the World</span>
        </h1>
        <p className="text-lg text-purple-200 mb-10 max-w-2xl mx-auto">
          Search millions of properties for sale and rent across 150+ countries
        </p>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
          {/* Listing type tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {listingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setListingType(type.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  listingType === type.value
                    ? 'bg-purple-700 text-white'
                    : 'text-purple-600 hover:bg-pink-50',
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  aiMode
                    ? 'Try: "2-bed apartment under €300k near the beach in Spain"'
                    : 'City, neighborhood, address, or postal code...'
                }
                className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setAiMode(!aiMode)}
              className={cn(
                'px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2',
                aiMode ? 'bg-pink-500 text-white border-pink-500' : 'border-purple-200 text-purple-600 hover:bg-pink-50',
              )}
              title="AI-powered natural language search"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:block">AI Search</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {aiMode && (
            <p className="mt-2 text-xs text-pink-500 text-left">
              ✨ AI mode: describe your ideal property in natural language
            </p>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Apartments in Madrid', 'Houses in London', 'Villas in Marbella', 'Condos in Miami', 'Flats in Paris'].map((q) => (
            <button
              key={q}
              onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
