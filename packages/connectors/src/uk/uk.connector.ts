/**
 * UK Connector - Rightmove / Zoopla style feed adapter
 *
 * COMPLIANCE NOTE:
 * - Designed for use with Rightmove's official Data Feed (RDF) or Zoopla's API
 * - Requires signed partnership agreement and API credentials
 * - Respects rate limits and data licensing terms
 * - See: https://www.rightmove.co.uk/developer/
 */

import axios from 'axios';
import { BaseConnector, ConnectorConfig, NormalizedListing } from '../../../apps/api/src/ingestion/base-connector';

const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Detached house': 'HOUSE',
  'Semi-detached house': 'HOUSE',
  'Terraced house': 'TOWNHOUSE',
  Flat: 'APARTMENT',
  Maisonette: 'DUPLEX',
  Bungalow: 'HOUSE',
  'Studio flat': 'STUDIO',
  Penthouse: 'PENTHOUSE',
  'Land / Plot': 'LAND',
  'Commercial property': 'OFFICE',
};

export class UKConnector extends BaseConnector {
  readonly connectorId = 'uk-rightmove';
  readonly countryCode = 'GB';
  readonly name = 'UK - Rightmove Data Feed';

  async fetch(options?: { since?: Date; page?: number }): Promise<any[]> {
    // Rightmove RDF uses HTTPS XML feed with branch-level authentication
    await this.sleep(500);

    const response = await axios.get(`${this.config.feedUrl}/properties`, {
      params: {
        api_key: this.config.apiKey,
        page: options?.page || 1,
        per_page: 100,
        updated_since: options?.since?.toISOString(),
      },
    });

    return response.data.properties || [];
  }

  normalize(raw: any): NormalizedListing | null {
    try {
      if (!raw.id || !raw.price?.amount) return null;

      const isRent = raw.channel === 'RENT';

      return {
        externalId: String(raw.id),
        sourceConnector: this.connectorId,
        sourceUrl: `https://www.rightmove.co.uk/properties/${raw.id}`,
        title: raw.summary || `${raw.propertySubType} in ${raw.location?.town}`,
        description: raw.description,
        listingType: isRent ? 'RENT' : 'SALE',
        propertyType: PROPERTY_TYPE_MAP[raw.propertySubType] || 'HOUSE',
        price: raw.price.amount,
        currency: 'GBP',
        location: {
          country: 'United Kingdom',
          countryCode: 'GB',
          city: raw.location?.town || raw.location?.county,
          neighborhood: raw.location?.district,
          postalCode: raw.location?.outcode,
          address: raw.displayAddress,
          latitude: raw.location?.latitude,
          longitude: raw.location?.longitude,
        },
        builtArea: raw.floorplanImages?.[0]?.caption ? undefined : undefined,
        bedrooms: raw.bedrooms,
        bathrooms: raw.bathrooms,
        hasParking: raw.keyFeatures?.some((f: string) => f.toLowerCase().includes('parking')) || false,
        hasGarden: raw.keyFeatures?.some((f: string) => f.toLowerCase().includes('garden')) || false,
        mediaUrls: raw.images?.map((img: any) => img.url) || [],
        agencyName: raw.customer?.branchDisplayName,
        agentPhone: raw.customer?.contactTelephone,
      };
    } catch {
      return null;
    }
  }
}
