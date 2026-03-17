/**
 * Spain Connector - Idealista-style XML feed adapter
 *
 * COMPLIANCE NOTE:
 * - This connector is designed for use with Idealista's official partner API
 * - Requires a valid API key obtained through their official partner program
 * - Respects rate limits (1 req/sec for standard tier)
 * - Does NOT scrape or bypass any access controls
 * - See: https://www.idealista.com/labs/
 */

import axios from 'axios';
import { BaseConnector, ConnectorConfig, NormalizedListing } from '../../../apps/api/src/ingestion/base-connector';

const LISTING_TYPE_MAP: Record<string, string> = {
  sale: 'SALE',
  rent: 'RENT',
  'short-term': 'SHORT_TERM',
  commercial: 'COMMERCIAL',
  land: 'LAND',
  'new-development': 'NEW_DEVELOPMENT',
};

const PROPERTY_TYPE_MAP: Record<string, string> = {
  flat: 'APARTMENT',
  house: 'HOUSE',
  chalet: 'VILLA',
  duplex: 'DUPLEX',
  penthouse: 'PENTHOUSE',
  studio: 'STUDIO',
  office: 'OFFICE',
  premises: 'RETAIL',
  garage: 'PARKING',
  land: 'LAND',
};

export class SpainConnector extends BaseConnector {
  readonly connectorId = 'spain-idealista';
  readonly countryCode = 'ES';
  readonly name = 'Spain - Idealista Partner Feed';

  private readonly baseUrl = 'https://api.idealista.com/3.5/es';
  private accessToken: string | null = null;

  constructor(config: ConnectorConfig) {
    super(config);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    // OAuth2 client credentials flow (Idealista partner API)
    const credentials = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64');
    const response = await axios.post(
      'https://api.idealista.com/oauth/token',
      'grant_type=client_credentials&scope=read',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async fetch(options?: { since?: Date; page?: number }): Promise<any[]> {
    const token = await this.getAccessToken();
    const page = options?.page || 1;

    // Rate limit: 1 request per second
    await this.sleep(1000);

    const response = await axios.post(
      `${this.baseUrl}/search`,
      {
        country: 'es',
        numPage: page,
        maxItems: 50,
        operation: 'sale',
        propertyType: 'homes',
        order: 'publicationDate',
        sort: 'desc',
        ...(options?.since && { since: options.since.toISOString() }),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data.elementList || [];
  }

  normalize(raw: any): NormalizedListing | null {
    try {
      if (!raw.propertyCode || !raw.price || !raw.latitude || !raw.longitude) return null;

      return {
        externalId: String(raw.propertyCode),
        sourceConnector: this.connectorId,
        sourceUrl: raw.url,
        title: raw.suggestedTexts?.title || `${raw.propertyType} in ${raw.municipality}`,
        description: raw.suggestedTexts?.subtitle,
        listingType: LISTING_TYPE_MAP[raw.operation] || 'SALE',
        propertyType: PROPERTY_TYPE_MAP[raw.propertyType] || 'APARTMENT',
        price: raw.price,
        currency: 'EUR',
        location: {
          country: 'Spain',
          countryCode: 'ES',
          city: raw.municipality || raw.district,
          neighborhood: raw.neighborhood,
          postalCode: raw.postalCode,
          address: raw.address,
          latitude: raw.latitude,
          longitude: raw.longitude,
        },
        builtArea: raw.size,
        bedrooms: raw.rooms,
        bathrooms: raw.bathrooms,
        hasParking: raw.parkingSpace?.hasParkingSpace || false,
        hasPool: raw.hasSwimmingPool || false,
        hasGarden: raw.hasGarden || false,
        hasTerrace: raw.hasTerrace || false,
        hasBalcony: raw.hasBalcony || false,
        hasElevator: raw.hasLift || false,
        hasAirConditioning: raw.airConditioning || false,
        energyRating: raw.energyCertification?.energyConsumption?.type,
        mediaUrls: raw.thumbnail ? [raw.thumbnail] : [],
        agencyName: raw.agency?.name,
      };
    } catch {
      return null;
    }
  }
}
