/**
 * Base class for all country/source ingestion connectors.
 * Each connector must implement fetch() and normalize().
 *
 * Compliance requirements:
 * - Respect robots.txt and ToS of source
 * - Implement rate limiting
 * - Only use approved APIs, feeds, or licensed data
 * - Track source attribution
 */

export interface NormalizedListing {
  externalId: string;
  sourceConnector: string;
  sourceUrl?: string;
  title: string;
  description?: string;
  listingType: string;
  propertyType: string;
  price: number;
  currency: string;
  location: {
    country: string;
    countryCode: string;
    city: string;
    neighborhood?: string;
    postalCode?: string;
    address?: string;
    latitude: number;
    longitude: number;
  };
  builtArea?: number;
  lotArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  isFurnished?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasAirConditioning?: boolean;
  isPetFriendly?: boolean;
  energyRating?: string;
  amenities?: string[];
  mediaUrls?: string[];
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agencyName?: string;
}

export interface ConnectorConfig {
  apiUrl?: string;
  apiKey?: string;
  feedUrl?: string;
  username?: string;
  password?: string;
  rateLimit?: number; // requests per minute
  [key: string]: any;
}

export abstract class BaseConnector {
  abstract readonly connectorId: string;
  abstract readonly countryCode: string;
  abstract readonly name: string;

  constructor(protected config: ConnectorConfig) {}

  /**
   * Fetch raw data from source. Must respect rate limits and ToS.
   */
  abstract fetch(options?: { since?: Date; page?: number }): Promise<any[]>;

  /**
   * Normalize raw source data into unified NormalizedListing schema.
   */
  abstract normalize(raw: any): NormalizedListing | null;

  /**
   * Validate that a normalized listing has required fields.
   */
  validate(listing: NormalizedListing): boolean {
    return !!(
      listing.externalId &&
      listing.title &&
      listing.price >= 0 &&
      listing.location?.latitude &&
      listing.location?.longitude &&
      listing.location?.city
    );
  }

  /**
   * Generate a deduplication fingerprint for a listing.
   */
  fingerprint(listing: NormalizedListing): string {
    const key = [
      listing.sourceConnector,
      listing.externalId,
      listing.location.countryCode,
      listing.location.city,
      listing.price,
    ].join('|');
    return Buffer.from(key).toString('base64');
  }

  protected sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async rateLimitedFetch<T>(fn: () => Promise<T>, delayMs = 1000): Promise<T> {
    await this.sleep(delayMs);
    return fn();
  }
}
