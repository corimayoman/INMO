'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Bed, Bath, Square, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { favoritesApi } from '@/lib/api';
import { formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  listing: any;
  compact?: boolean;
}

export function PropertyCard({ listing, compact = false }: PropertyCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [favorited, setFavorited] = useState(false);
  const [toggling, setToggling] = useState(false);

  const primaryImage = listing.media?.[0]?.url || listing.media?.[0]?.thumbnailUrl;
  const location = listing.location;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Sign in to save properties');
      return;
    }
    setToggling(true);
    try {
      const { data } = await favoritesApi.toggle(listing.id);
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Saved to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setToggling(false);
    }
  };

  return (
    <Link href={`/property/${listing.slug}`} className="property-card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
            <Square className="w-12 h-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge text-xs', listing.listingType === 'SALE' ? 'bg-brand-600 text-white' : 'bg-green-600 text-white')}>
            {getListingTypeLabel(listing.listingType)}
          </span>
          {listing.isFeatured && (
            <span className="badge bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />Featured
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={toggling}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            favorited ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white',
          )}
        >
          <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
            {listing.title}
          </h3>
        </div>

        <div className="text-xl font-bold text-brand-700 mb-2">
          {formatPrice(listing.price, listing.currency)}
          {listing.listingType === 'RENT' && <span className="text-sm font-normal text-gray-500">/mo</span>}
        </div>

        {location && (
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {[location.neighborhood, location.city, location.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {!compact && (
          <div className="flex items-center gap-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {listing.bathrooms} bath
              </span>
            )}
            {listing.builtArea != null && (
              <span className="flex items-center gap-1">
                <Square className="w-3.5 h-3.5" />
                {formatArea(listing.builtArea)}
              </span>
            )}
            <span className="ml-auto text-gray-400">{getPropertyTypeLabel(listing.propertyType)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
