import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    return `${Math.round(area * 10.764).toLocaleString()} ft²`;
  }
  return `${Math.round(area).toLocaleString()} m²`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
}

export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getListingTypeLabel(type: string): string {
  const map: Record<string, string> = {
    SALE: 'For Sale',
    RENT: 'For Rent',
    SHORT_TERM: 'Short-term',
    COMMERCIAL: 'Commercial',
    LAND: 'Land',
    NEW_DEVELOPMENT: 'New Development',
  };
  return map[type] || type;
}

export function getPropertyTypeLabel(type: string): string {
  const map: Record<string, string> = {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    VILLA: 'Villa',
    TOWNHOUSE: 'Townhouse',
    STUDIO: 'Studio',
    PENTHOUSE: 'Penthouse',
    DUPLEX: 'Duplex',
    LOFT: 'Loft',
    OFFICE: 'Office',
    RETAIL: 'Retail',
    WAREHOUSE: 'Warehouse',
    LAND: 'Land',
    PARKING: 'Parking',
  };
  return map[type] || type;
}

export function calculateMortgage(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}
