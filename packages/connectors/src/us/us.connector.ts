/**
 * US Connector - RESO Web API / MLS adapter
 *
 * COMPLIANCE NOTE:
 * - Uses RESO Web API standard (https://www.reso.org/reso-web-api/)
 * - Requires MLS membership and IDX/VOW license agreement
 * - Data usage governed by MLS rules and RESO standards
 * - Respects IDX display rules per MLS policy
 */

import axios from 'axios';
import { BaseConnector, ConnectorConfig, NormalizedListing } from '../../../apps/api/src/ingestion/base-connector';

const PROPERTY_TYPE_MAP: Record<string, string> = {
  Residential: 'HOUSE',
  Condominium: 'APARTMENT',
  Townhouse: 'TOWNHOUSE',
  'Multi-Family': 'HOUSE',
  Land: 'LAND',
  Commercial: 'OFFICE',
  'Mobile Home': 'HOUSE',
};

const STATUS_MAP: Record<string, string> = {
  Active: 'ACTIVE',
  Pending: 'PAUSED',
  Sold: 'SOLD',
  Expired: 'EXPIRED',
  Withdrawn: 'ARCHIVED',
};

export class USConnector extends BaseConnector {
  readonly connectorId = 'us-reso-mls';
  readonly countryCode = 'US';
  readonly name = 'US - RESO Web API / MLS';

  async fetch(options?: { since?: Date; page?: number }): Promise<any[]> {
    // RESO Web API OData endpoint
    await this.sleep(200);

    const params: any = {
      $top: 100,
      $skip: ((options?.page || 1) - 1) * 100,
      $select: 'ListingKey,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,StandardStatus,City,StateOrProvince,PostalCode,Latitude,Longitude,PublicRemarks,ListAgentFullName,ListOfficeName,Media',
      $filter: "StandardStatus eq 'Active'",
    };

    if (options?.since) {
      params.$filter += ` and ModificationTimestamp gt ${options.since.toISOString()}`;
    }

    const response = await axios.get(`${this.config.apiUrl}/Property`, {
      params,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        Accept: 'application/json',
      },
    });

    return response.data.value || [];
  }

  normalize(raw: any): NormalizedListing | null {
    try {
      if (!raw.ListingKey || !raw.ListPrice || !raw.Latitude || !raw.Longitude) return null;

      return {
        externalId: String(raw.ListingKey),
        sourceConnector: this.connectorId,
        title: `${raw.BedroomsTotal || ''} bed ${raw.PropertyType || 'Property'} in ${raw.City}, ${raw.StateOrProvince}`.trim(),
        description: raw.PublicRemarks,
        listingType: 'SALE',
        propertyType: PROPERTY_TYPE_MAP[raw.PropertyType] || 'HOUSE',
        price: raw.ListPrice,
        currency: 'USD',
        location: {
          country: 'United States',
          countryCode: 'US',
          city: raw.City,
          neighborhood: raw.SubdivisionName,
          postalCode: raw.PostalCode,
          address: raw.UnparsedAddress,
          latitude: raw.Latitude,
          longitude: raw.Longitude,
        },
        builtArea: raw.LivingArea ? raw.LivingArea * 0.0929 : undefined, // sqft to sqm
        bedrooms: raw.BedroomsTotal,
        bathrooms: raw.BathroomsTotalInteger,
        hasParking: raw.GarageSpaces > 0,
        mediaUrls: raw.Media?.map((m: any) => m.MediaURL) || [],
        agentName: raw.ListAgentFullName,
        agencyName: raw.ListOfficeName,
      };
    } catch {
      return null;
    }
  }
}
