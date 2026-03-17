export type ListingType = 'SALE' | 'RENT' | 'SHORT_TERM' | 'COMMERCIAL' | 'LAND' | 'NEW_DEVELOPMENT';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'TOWNHOUSE' | 'STUDIO' | 'PENTHOUSE' | 'DUPLEX' | 'LOFT' | 'OFFICE' | 'RETAIL' | 'WAREHOUSE' | 'INDUSTRIAL' | 'LAND' | 'PARKING' | 'OTHER';
export type ListingStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'SOLD' | 'RENTED' | 'EXPIRED' | 'REJECTED' | 'ARCHIVED';
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface PropertyLocation {
  country: string;
  countryCode: string;
  region?: string;
  state?: string;
  city: string;
  neighborhood?: string;
  postalCode?: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export interface PropertyMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'FLOORPLAN' | 'VIRTUAL_TOUR' | 'DOCUMENT';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface PropertyListing {
  id: string;
  title: string;
  slug: string;
  description?: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: ListingStatus;
  location: PropertyLocation;
  price: number;
  currency: string;
  pricePerSqm?: number;
  builtArea?: number;
  lotArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  isFurnished?: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  hasAirConditioning: boolean;
  hasHeating: boolean;
  isPetFriendly?: boolean;
  energyRating?: EnergyRating;
  amenities: string[];
  media: PropertyMedia[];
  agent?: AgentSummary;
  agency?: AgencySummary;
  viewCount: number;
  favoriteCount: number;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSummary {
  id: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  agencyName?: string;
  isVerified: boolean;
}

export interface AgencySummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isVerified: boolean;
}

export interface SearchFilters {
  query?: string;
  listingType?: ListingType;
  propertyType?: PropertyType[];
  countryCode?: string;
  city?: string;
  neighborhood?: string;
  postalCode?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  builtAreaMin?: number;
  builtAreaMax?: number;
  lotAreaMin?: number;
  lotAreaMax?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  isFurnished?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasAirConditioning?: boolean;
  isPetFriendly?: boolean;
  energyRating?: EnergyRating[];
  amenities?: string[];
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  polygon?: [number, number][];
  nearLat?: number;
  nearLng?: number;
  nearRadius?: number; // km
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'price_per_sqm' | 'most_viewed';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  listings: PropertyListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  aggregations?: SearchAggregations;
}

export interface SearchAggregations {
  priceMin: number;
  priceMax: number;
  avgPrice: number;
  byPropertyType: Record<string, number>;
  byListingType: Record<string, number>;
  byCity: Array<{ city: string; count: number }>;
}
