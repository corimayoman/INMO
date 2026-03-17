import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(
    private searchService: SearchService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Full-text + filtered property search via Elasticsearch' })
  async search(@Query() query: any) {
    const filters = {
      query: query.q,
      listingType: query.listingType,
      propertyType: query.propertyType ? (Array.isArray(query.propertyType) ? query.propertyType : [query.propertyType]) : undefined,
      countryCode: query.countryCode,
      city: query.city,
      neighborhood: query.neighborhood,
      postalCode: query.postalCode,
      priceMin: query.priceMin ? +query.priceMin : undefined,
      priceMax: query.priceMax ? +query.priceMax : undefined,
      bedroomsMin: query.bedroomsMin ? +query.bedroomsMin : undefined,
      bedroomsMax: query.bedroomsMax ? +query.bedroomsMax : undefined,
      builtAreaMin: query.builtAreaMin ? +query.builtAreaMin : undefined,
      builtAreaMax: query.builtAreaMax ? +query.builtAreaMax : undefined,
      hasPool: query.hasPool === 'true',
      hasGarden: query.hasGarden === 'true',
      hasTerrace: query.hasTerrace === 'true',
      hasBalcony: query.hasBalcony === 'true',
      hasElevator: query.hasElevator === 'true',
      hasParking: query.hasParking === 'true',
      hasAirConditioning: query.hasAirConditioning === 'true',
      isPetFriendly: query.isPetFriendly === 'true',
      isFurnished: query.isFurnished !== undefined ? query.isFurnished === 'true' : undefined,
      energyRating: query.energyRating ? (Array.isArray(query.energyRating) ? query.energyRating : [query.energyRating]) : undefined,
      bbox: query.bbox ? query.bbox.split(',').map(Number) as [number, number, number, number] : undefined,
      nearLat: query.nearLat ? +query.nearLat : undefined,
      nearLng: query.nearLng ? +query.nearLng : undefined,
      nearRadius: query.nearRadius ? +query.nearRadius : undefined,
      sortBy: query.sortBy,
      page: query.page ? +query.page : 1,
      limit: query.limit ? Math.min(+query.limit, 100) : 20,
    };

    const esResult = await this.searchService.search(filters);

    // Hydrate from DB
    const listings = await this.prisma.listing.findMany({
      where: { id: { in: esResult.ids } },
      include: {
        location: true,
        media: { where: { isPrimary: true }, take: 1 },
        agent: { include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
        agency: { select: { id: true, name: true, slug: true, logoUrl: true, isVerified: true } },
      },
    });

    // Preserve ES sort order
    const ordered = esResult.ids.map((id) => listings.find((l) => l.id === id)).filter(Boolean);

    return {
      listings: ordered,
      total: esResult.total,
      page: esResult.page,
      limit: esResult.limit,
      totalPages: esResult.totalPages,
      aggregations: esResult.aggregations,
    };
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Location autocomplete suggestions' })
  async autocomplete(@Query('q') q: string) {
    if (!q || q.length < 2) return { suggestions: [] };

    const [cities, neighborhoods] = await Promise.all([
      this.prisma.location.findMany({
        where: { city: { contains: q, mode: 'insensitive' } },
        select: { city: true, country: true, countryCode: true },
        distinct: ['city', 'countryCode'],
        take: 5,
      }),
      this.prisma.location.findMany({
        where: { neighborhood: { contains: q, mode: 'insensitive' } },
        select: { neighborhood: true, city: true, countryCode: true },
        distinct: ['neighborhood', 'city'],
        take: 5,
      }),
    ]);

    return {
      suggestions: [
        ...cities.map((c) => ({ type: 'city', label: `${c.city}, ${c.country}`, value: c.city, countryCode: c.countryCode })),
        ...neighborhoods.filter((n) => n.neighborhood).map((n) => ({ type: 'neighborhood', label: `${n.neighborhood}, ${n.city}`, value: n.neighborhood, city: n.city })),
      ],
    };
  }
}
