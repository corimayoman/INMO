import { create } from 'zustand';

interface SearchState {
  query: string;
  listingType: string;
  propertyType: string[];
  countryCode: string;
  city: string;
  priceMin: number | null;
  priceMax: number | null;
  bedroomsMin: number | null;
  hasPool: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  isPetFriendly: boolean;
  isFurnished: boolean | null;
  sortBy: string;
  viewMode: 'list' | 'map' | 'split';
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'list' | 'map' | 'split') => void;
}

const defaults = {
  query: '',
  listingType: 'SALE',
  propertyType: [],
  countryCode: '',
  city: '',
  priceMin: null,
  priceMax: null,
  bedroomsMin: null,
  hasPool: false,
  hasGarden: false,
  hasParking: false,
  isPetFriendly: false,
  isFurnished: null,
  sortBy: 'relevance',
  viewMode: 'list' as const,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...defaults,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () => set(defaults),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
