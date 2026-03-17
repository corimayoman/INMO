import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { SearchFilters } from '@wpf/shared';

const INDEX = 'listings';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Client;

  constructor(private config: ConfigService) {
    this.client = new Client({
      node: config.get('ELASTICSEARCH_URL', 'http://localhost:9200'),
      auth: config.get('ELASTICSEARCH_USERNAME')
        ? { username: config.get('ELASTICSEARCH_USERNAME'), password: config.get('ELASTICSEARCH_PASSWORD') }
        : undefined,
    });
  }

  async onModuleInit() {
    await this.ensureIndex();
  }

  async ensureIndex() {
    try {
      const exists = await this.client.indices.exists({ index: INDEX });
      if (!exists) {
        await this.client.indices.create({
          index: INDEX,
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text', analyzer: 'standard' },
              description: { type: 'text', analyzer: 'standard' },
              listingType: { type: 'keyword' },
              propertyType: { type: 'keyword' },
              status: { type: 'keyword' },
              price: { type: 'double' },
              currency: { type: 'keyword' },
              pricePerSqm: { type: 'double' },
              bedrooms: { type: 'integer' },
              bathrooms: { type: 'float' },
              builtArea: { type: 'double' },
              lotArea: { type: 'double' },
              hasPool: { type: 'boolean' },
              hasGarden: { type: 'boolean' },
              hasTerrace: { type: 'boolean' },
              hasBalcony: { type: 'boolean' },
              hasElevator: { type: 'boolean' },
              hasParking: { type: 'boolean' },
              hasAirConditioning: { type: 'boolean' },
              isPetFriendly: { type: 'boolean' },
              isFurnished: { type: 'boolean' },
              energyRating: { type: 'keyword' },
              amenities: { type: 'keyword' },
              isFeatured: { type: 'boolean' },
              viewCount: { type: 'integer' },
              publishedAt: { type: 'date' },
              location: {
                properties: {
                  countryCode: { type: 'keyword' },
                  country: { type: 'keyword' },
                  city: { type: 'keyword' },
                  neighborhood: { type: 'keyword' },
                  postalCode: { type: 'keyword' },
                  coordinates: { type: 'geo_point' },
                },
              },
            },
          },
        });
        this.logger.log('Elasticsearch index created');
      }
    } catch (err) {
      this.logger.error('Failed to create ES index', err);
    }
  }

  async indexListing(listing: any) {
    try {
      await this.client.index({
        index: INDEX,
        id: listing.id,
        document: {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          listingType: listing.listingType,
          propertyType: listing.propertyType,
          status: listing.status,
          price: listing.price,
          currency: listing.currency,
          pricePerSqm: listing.pricePerSqm,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          builtArea: listing.builtArea,
          lotArea: listing.lotArea,
          hasPool: listing.hasPool,
          hasGarden: listing.hasGarden,
          hasTerrace: listing.hasTerrace,
          hasBalcony: listing.hasBalcony,
          hasElevator: listing.hasElevator,
          hasParking: listing.hasParking,
          hasAirConditioning: listing.hasAirConditioning,
          isPetFriendly: listing.isPetFriendly,
          isFurnished: listing.isFurnished,
          energyRating: listing.energyRating,
          amenities: listing.amenities,
          isFeatured: listing.isFeatured,
          viewCount: listing.viewCount,
          publishedAt: listing.publishedAt,
          location: listing.location
            ? {
                countryCode: listing.location.countryCode,
                country: listing.location.country,
                city: listing.location.city,
                neighborhood: listing.location.neighborhood,
                postalCode: listing.location.postalCode,
                coordinates: {
                  lat: listing.location.latitude,
                  lon: listing.location.longitude,
                },
              }
            : undefined,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to index listing ${listing.id}`, err);
    }
  }

  async removeListing(id: string) {
    try {
      await this.client.delete({ index: INDEX, id });
    } catch (err) {
      this.logger.warn(`Failed to remove listing ${id} from index`);
    }
  }

  async search(filters: SearchFilters) {
    const { page = 1, limit = 20 } = filters;
    const from = (page - 1) * limit;

    const must: any[] = [{ term: { status: 'ACTIVE' } }];
    const filter: any[] = [];

    // Full-text search
    if (filters.query) {
      must.push({
        multi_match: {
          query: filters.query,
          fields: ['title^3', 'description', 'location.city^2', 'location.neighborhood^2'],
          fuzziness: 'AUTO',
        },
      });
    }

    // Filters
    if (filters.listingType) filter.push({ term: { listingType: filters.listingType } });
    if (filters.propertyType?.length) filter.push({ terms: { propertyType: filters.propertyType } });
    if (filters.countryCode) filter.push({ term: { 'location.countryCode': filters.countryCode } });
    if (filters.city) filter.push({ term: { 'location.city': filters.city } });
    if (filters.neighborhood) filter.push({ term: { 'location.neighborhood': filters.neighborhood } });
    if (filters.postalCode) filter.push({ term: { 'location.postalCode': filters.postalCode } });

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filter.push({ range: { price: { gte: filters.priceMin, lte: filters.priceMax } } });
    }
    if (filters.bedroomsMin !== undefined) filter.push({ range: { bedrooms: { gte: filters.bedroomsMin } } });
    if (filters.bedroomsMax !== undefined) filter.push({ range: { bedrooms: { lte: filters.bedroomsMax } } });
    if (filters.builtAreaMin !== undefined || filters.builtAreaMax !== undefined) {
      filter.push({ range: { builtArea: { gte: filters.builtAreaMin, lte: filters.builtAreaMax } } });
    }

    if (filters.hasPool) filter.push({ term: { hasPool: true } });
    if (filters.hasGarden) filter.push({ term: { hasGarden: true } });
    if (filters.hasTerrace) filter.push({ term: { hasTerrace: true } });
    if (filters.hasBalcony) filter.push({ term: { hasBalcony: true } });
    if (filters.hasElevator) filter.push({ term: { hasElevator: true } });
    if (filters.hasParking) filter.push({ term: { hasParking: true } });
    if (filters.hasAirConditioning) filter.push({ term: { hasAirConditioning: true } });
    if (filters.isPetFriendly) filter.push({ term: { isPetFriendly: true } });
    if (filters.isFurnished !== undefined) filter.push({ term: { isFurnished: filters.isFurnished } });
    if (filters.energyRating?.length) filter.push({ terms: { energyRating: filters.energyRating } });
    if (filters.amenities?.length) filter.push({ terms: { amenities: filters.amenities } });

    // Geo filters
    if (filters.bbox) {
      const [minLng, minLat, maxLng, maxLat] = filters.bbox;
      filter.push({
        geo_bounding_box: {
          'location.coordinates': {
            top_left: { lat: maxLat, lon: minLng },
            bottom_right: { lat: minLat, lon: maxLng },
          },
        },
      });
    }

    if (filters.nearLat && filters.nearLng && filters.nearRadius) {
      filter.push({
        geo_distance: {
          distance: `${filters.nearRadius}km`,
          'location.coordinates': { lat: filters.nearLat, lon: filters.nearLng },
        },
      });
    }

    // Sort
    const sort = this.buildSort(filters.sortBy);

    const response = await this.client.search({
      index: INDEX,
      from,
      size: limit,
      query: { bool: { must, filter } },
      sort,
      aggs: {
        price_stats: { stats: { field: 'price' } },
        by_property_type: { terms: { field: 'propertyType', size: 20 } },
        by_listing_type: { terms: { field: 'listingType', size: 10 } },
        by_city: { terms: { field: 'location.city', size: 20 } },
      },
    });

    const hits = response.hits.hits;
    const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value || 0;
    const aggs = response.aggregations as any;

    return {
      ids: hits.map((h) => h._id),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      aggregations: {
        priceMin: aggs?.price_stats?.min || 0,
        priceMax: aggs?.price_stats?.max || 0,
        avgPrice: aggs?.price_stats?.avg || 0,
        byPropertyType: Object.fromEntries(
          (aggs?.by_property_type?.buckets || []).map((b: any) => [b.key, b.doc_count]),
        ),
        byListingType: Object.fromEntries(
          (aggs?.by_listing_type?.buckets || []).map((b: any) => [b.key, b.doc_count]),
        ),
        byCity: (aggs?.by_city?.buckets || []).map((b: any) => ({ city: b.key, count: b.doc_count })),
      },
    };
  }

  private buildSort(sortBy?: string) {
    const map: Record<string, any> = {
      newest: [{ publishedAt: 'desc' }],
      price_asc: [{ price: 'asc' }],
      price_desc: [{ price: 'desc' }],
      price_per_sqm: [{ pricePerSqm: 'asc' }],
      most_viewed: [{ viewCount: 'desc' }],
    };
    return map[sortBy || ''] || [{ isFeatured: 'desc' }, { _score: 'desc' }];
  }
}
