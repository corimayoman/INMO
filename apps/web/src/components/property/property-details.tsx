import { Bed, Bath, Square, Calendar, Zap, Car, Waves, Trees, Wind, PawPrint, Accessibility } from 'lucide-react';
import { formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';

export function PropertyDetails({ listing }: { listing: any }) {
  const { location } = listing;

  const features = [
    { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: listing.bathrooms },
    { icon: Square, label: 'Built area', value: listing.builtArea ? formatArea(listing.builtArea) : null },
    { icon: Square, label: 'Lot area', value: listing.lotArea ? formatArea(listing.lotArea) : null },
    { icon: Calendar, label: 'Year built', value: listing.yearBuilt },
    { icon: Car, label: 'Parking', value: listing.parkingSpaces ? `${listing.parkingSpaces} space${listing.parkingSpaces > 1 ? 's' : ''}` : null },
  ].filter((f) => f.value != null);

  const amenities = [
    { icon: Waves, label: 'Pool', active: listing.hasPool },
    { icon: Trees, label: 'Garden', active: listing.hasGarden },
    { icon: Wind, label: 'Air conditioning', active: listing.hasAirConditioning },
    { icon: PawPrint, label: 'Pet friendly', active: listing.isPetFriendly },
    { icon: Accessibility, label: 'Accessible', active: listing.isAccessible },
  ].filter((a) => a.active);

  return (
    <div className="space-y-6">
      {/* Title & price */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge-blue">{getListingTypeLabel(listing.listingType)}</span>
          <span className="badge bg-gray-100 text-gray-700">{getPropertyTypeLabel(listing.propertyType)}</span>
          {listing.isFurnished && <span className="badge bg-green-50 text-green-700">Furnished</span>}
          {listing.energyRating && <span className="badge bg-yellow-50 text-yellow-700">Energy: {listing.energyRating}</span>}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <p className="text-gray-500 text-sm">{[location?.address, location?.neighborhood, location?.city, location?.country].filter(Boolean).join(', ')}</p>
        <div className="mt-3">
          <span className="text-3xl font-bold text-brand-700">{formatPrice(listing.price, listing.currency)}</span>
          {listing.listingType === 'RENT' && <span className="text-gray-500 ml-1">/month</span>}
          {listing.pricePerSqm && <span className="text-sm text-gray-500 ml-3">{formatPrice(listing.pricePerSqm, listing.currency)}/m²</span>}
        </div>
      </div>

      {/* Key features */}
      {features.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          {features.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm font-semibold text-gray-900">{String(value)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {listing.description && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
        </div>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenities.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
            {listing.amenities?.map((a: string) => (
              <span key={a} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Agent info */}
      {listing.agent && (
        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
            {listing.agent.user?.firstName?.[0] || 'A'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{listing.agent.user?.firstName} {listing.agent.user?.lastName}</div>
            <div className="text-sm text-gray-500">{listing.agency?.name || 'Independent agent'}</div>
          </div>
          {listing.agency?.isVerified && <span className="ml-auto badge-blue">Verified</span>}
        </div>
      )}
    </div>
  );
}
