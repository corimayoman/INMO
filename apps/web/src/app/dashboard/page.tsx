'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Heart, Search, Bell, Home, Calendar, MessageCircle, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { favoritesApi, savedSearchesApi, viewingsApi, inquiriesApi } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: favorites } = useQuery({ queryKey: ['favorites'], queryFn: () => favoritesApi.getAll().then((r) => r.data) });
  const { data: savedSearches } = useQuery({ queryKey: ['saved-searches'], queryFn: () => savedSearchesApi.getAll().then((r) => r.data) });
  const { data: viewings } = useQuery({ queryKey: ['viewings'], queryFn: () => viewingsApi.getMy().then((r) => r.data) });

  const isAgent = user?.role === 'AGENT' || user?.role === 'AGENCY_ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'there'}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your properties</p>
        </div>
        {isAgent && (
          <Link href="/dashboard/listings/new" className="btn-primary">
            <Plus className="w-4 h-4" />New listing
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Heart, label: 'Saved properties', value: favorites?.length || 0, href: '/favorites' },
          { icon: Search, label: 'Saved searches', value: savedSearches?.length || 0, href: '/dashboard/saved-searches' },
          { icon: Calendar, label: 'Upcoming viewings', value: viewings?.filter((v: any) => !v.cancelled).length || 0, href: '/dashboard/viewings' },
          { icon: MessageCircle, label: 'Inquiries', value: 0, href: '/dashboard/inquiries' },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Saved properties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Saved properties</h2>
            <Link href="/favorites" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {favorites?.length ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {favorites.slice(0, 4).map((fav: any) => <PropertyCard key={fav.id} listing={fav.listing} compact />)}
            </div>
          ) : (
            <div className="card p-8 text-center text-gray-500">
              <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No saved properties yet</p>
              <Link href="/search" className="btn-primary mt-3 text-sm">Start searching</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming viewings */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Upcoming viewings</h2>
            {viewings?.filter((v: any) => !v.cancelled).length ? (
              <div className="space-y-3">
                {viewings.filter((v: any) => !v.cancelled).slice(0, 3).map((viewing: any) => (
                  <div key={viewing.id} className="card p-4">
                    <div className="text-sm font-medium text-gray-900 truncate">{viewing.listing?.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(viewing.scheduledAt)}</div>
                    {viewing.confirmed && <span className="badge-green mt-2 inline-block">Confirmed</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center text-gray-500 text-sm">No upcoming viewings</div>
            )}
          </div>

          {/* Saved searches */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Saved searches</h2>
            {savedSearches?.length ? (
              <div className="space-y-2">
                {savedSearches.slice(0, 3).map((search: any) => (
                  <Link key={search.id} href={`/search?${new URLSearchParams(search.filters).toString()}`} className="card p-3 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
                    <Search className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{search.name}</span>
                    {search.alertEnabled && <Bell className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center text-gray-500 text-sm">No saved searches</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
