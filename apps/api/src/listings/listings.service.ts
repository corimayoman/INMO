import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import slugify from 'slugify';
import * as ngeohash from 'ngeohash';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
  ) {}

  async create(dto: CreateListingDto, userId: string) {
    const slug = await this.generateUniqueSlug(dto.title);
    const geohash = ngeohash.encode(dto.location.latitude, dto.location.longitude, 7);

    // Upsert location
    const location = await this.prisma.location.upsert({
      where: {
        id: `${dto.location.countryCode}-${dto.location.city}-${dto.location.postalCode || 'none'}-${dto.location.latitude.toFixed(4)}-${dto.location.longitude.toFixed(4)}`,
      },
      create: { ...dto.location, geohash, id: `${dto.location.countryCode}-${dto.location.city}-${dto.location.postalCode || 'none'}-${dto.location.latitude.toFixed(4)}-${dto.location.longitude.toFixed(4)}` },
      update: {},
    });

    const listing = await this.prisma.listing.create({
      data: {
        ...dto,
        slug,
        locationId: location.id,
        location: undefined,
        status: 'PENDING_REVIEW',
      },
      include: this.defaultIncludes(),
    });

    await this.searchService.indexListing(listing);
    return listing;
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);
    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        include: this.defaultIncludes(),
        skip,
        take: +limit,
        orderBy: this.buildOrderBy(filters.sortBy),
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { listings, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      include: {
        ...this.defaultIncludes(),
        media: { orderBy: { sortOrder: 'asc' } },
        priceHistoryRecords: { orderBy: { changedAt: 'desc' }, take: 10 },
      },
    });
    if (!listing) throw new NotFoundException('Listing not found');

    // Increment view count
    await this.prisma.listing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: this.defaultIncludes(),
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async update(id: string, dto: UpdateListingDto, userId: string) {
    const listing = await this.findById(id);
    this.checkOwnership(listing, userId);

    const updated = await this.prisma.listing.update({
      where: { id },
      data: dto,
      include: this.defaultIncludes(),
    });

    await this.searchService.indexListing(updated);
    return updated;
  }

  async delete(id: string, userId: string) {
    const listing = await this.findById(id);
    this.checkOwnership(listing, userId);
    await this.prisma.listing.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
    await this.searchService.removeListing(id);
  }

  async publish(id: string, userId: string) {
    const listing = await this.findById(id);
    this.checkOwnership(listing, userId);
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'ACTIVE', publishedAt: new Date() },
    });
  }

  async getSimilar(id: string, limit = 6) {
    const listing = await this.findById(id);
    return this.prisma.listing.findMany({
      where: {
        id: { not: id },
        status: 'ACTIVE',
        listingType: listing.listingType,
        propertyType: listing.propertyType,
        locationId: listing.locationId,
      },
      include: this.defaultIncludes(),
      take: limit,
    });
  }

  private buildWhereClause(filters: any) {
    const where: any = { status: 'ACTIVE' };

    if (filters.listingType) where.listingType = filters.listingType;
    if (filters.propertyType) where.propertyType = { in: Array.isArray(filters.propertyType) ? filters.propertyType : [filters.propertyType] };
    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price.gte = +filters.priceMin;
      if (filters.priceMax) where.price.lte = +filters.priceMax;
    }
    if (filters.bedroomsMin) where.bedrooms = { gte: +filters.bedroomsMin };
    if (filters.hasPool) where.hasPool = true;
    if (filters.hasGarden) where.hasGarden = true;
    if (filters.hasParking) where.hasParking = true;
    if (filters.isPetFriendly) where.isPetFriendly = true;
    if (filters.isFurnished !== undefined) where.isFurnished = filters.isFurnished === 'true';

    if (filters.countryCode || filters.city || filters.neighborhood) {
      where.location = {};
      if (filters.countryCode) where.location.countryCode = filters.countryCode;
      if (filters.city) where.location.city = { contains: filters.city, mode: 'insensitive' };
      if (filters.neighborhood) where.location.neighborhood = { contains: filters.neighborhood, mode: 'insensitive' };
    }

    return where;
  }

  private buildOrderBy(sortBy?: string) {
    const map: Record<string, any> = {
      newest: { publishedAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      price_per_sqm: { pricePerSqm: 'asc' },
      most_viewed: { viewCount: 'desc' },
    };
    return map[sortBy] || { isFeatured: 'desc' };
  }

  private checkOwnership(listing: any, userId: string) {
    const isOwner = listing.agent?.userId === userId || listing.owner?.userId === userId;
    if (!isOwner) throw new ForbiddenException('Not authorized to modify this listing');
  }

  private defaultIncludes() {
    return {
      location: true,
      media: { where: { isPrimary: true }, take: 1 },
      agent: { include: { user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } } } },
      agency: { select: { id: true, name: true, slug: true, logoUrl: true, isVerified: true } },
    };
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title, { lower: true, strict: true });
    let slug = base;
    let counter = 1;
    while (await this.prisma.listing.findUnique({ where: { slug } })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }
}
