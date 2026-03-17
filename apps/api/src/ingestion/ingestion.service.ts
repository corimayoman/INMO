import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { BaseConnector, NormalizedListing } from './base-connector';
import slugify from 'slugify';
import * as ngeohash from 'ngeohash';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectQueue('ingestion') private ingestionQueue: Queue,
    private prisma: PrismaService,
    private searchService: SearchService,
    private config: ConfigService,
  ) {}

  @Cron('0 */6 * * *') // Every 6 hours
  async scheduleAllConnectors() {
    const connectors = await this.prisma.sourceConnector.findMany({
      where: { isActive: true },
    });

    for (const connector of connectors) {
      await this.ingestionQueue.add('run-connector', { connectorId: connector.id }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
    }

    this.logger.log(`Scheduled ${connectors.length} connectors`);
  }

  async runConnector(connectorId: string) {
    const connectorConfig = await this.prisma.sourceConnector.findUnique({
      where: { id: connectorId },
    });
    if (!connectorConfig) throw new Error(`Connector ${connectorId} not found`);

    const job = await this.prisma.importJob.create({
      data: { connectorId, status: 'RUNNING', startedAt: new Date() },
    });

    try {
      const connector = await this.loadConnector(connectorConfig);
      let page = 1;
      let totalProcessed = 0;
      let newListings = 0;
      let updatedListings = 0;
      let failedRecords = 0;

      while (true) {
        const rawItems = await connector.fetch({ page });
        if (!rawItems.length) break;

        for (const raw of rawItems) {
          try {
            const normalized = connector.normalize(raw);
            if (!normalized || !connector.validate(normalized)) {
              failedRecords++;
              continue;
            }

            const result = await this.upsertListing(normalized);
            if (result.created) newListings++;
            else updatedListings++;
            totalProcessed++;
          } catch (err) {
            failedRecords++;
            this.logger.warn(`Failed to process record: ${err.message}`);
          }
        }

        page++;
        if (rawItems.length < 50) break; // Last page
      }

      await this.prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          totalRecords: totalProcessed + failedRecords,
          processedRecords: totalProcessed,
          newListings,
          updatedListings,
          failedRecords,
          completedAt: new Date(),
        },
      });

      await this.prisma.sourceConnector.update({
        where: { id: connectorId },
        data: { lastRunAt: new Date(), lastRunStatus: 'COMPLETED' },
      });

      this.logger.log(`Connector ${connectorConfig.name}: ${newListings} new, ${updatedListings} updated, ${failedRecords} failed`);
    } catch (err) {
      await this.prisma.importJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', errorLog: { error: err.message }, completedAt: new Date() },
      });
      await this.prisma.sourceConnector.update({
        where: { id: connectorId },
        data: { lastRunStatus: 'FAILED' },
      });
      throw err;
    }
  }

  async upsertListing(normalized: NormalizedListing): Promise<{ created: boolean }> {
    // Check for existing listing by externalId + connector
    const existing = await this.prisma.listing.findFirst({
      where: { externalId: normalized.externalId, sourceConnector: normalized.sourceConnector },
    });

    // Upsert location
    const geohash = ngeohash.encode(normalized.location.latitude, normalized.location.longitude, 7);
    const locationId = `${normalized.location.countryCode}-${normalized.location.city}-${normalized.location.postalCode || 'none'}-${normalized.location.latitude.toFixed(4)}-${normalized.location.longitude.toFixed(4)}`;

    await this.prisma.location.upsert({
      where: { id: locationId },
      create: { id: locationId, ...normalized.location, geohash },
      update: {},
    });

    const listingData = {
      externalId: normalized.externalId,
      sourceConnector: normalized.sourceConnector,
      sourceUrl: normalized.sourceUrl,
      sourceLastSyncAt: new Date(),
      title: normalized.title,
      description: normalized.description,
      listingType: normalized.listingType as any,
      propertyType: normalized.propertyType as any,
      price: normalized.price,
      currency: normalized.currency,
      pricePerSqm: normalized.builtArea ? normalized.price / normalized.builtArea : undefined,
      locationId,
      builtArea: normalized.builtArea,
      lotArea: normalized.lotArea,
      bedrooms: normalized.bedrooms,
      bathrooms: normalized.bathrooms,
      parkingSpaces: normalized.parkingSpaces,
      yearBuilt: normalized.yearBuilt,
      isFurnished: normalized.isFurnished,
      hasPool: normalized.hasPool || false,
      hasGarden: normalized.hasGarden || false,
      hasTerrace: normalized.hasTerrace || false,
      hasBalcony: normalized.hasBalcony || false,
      hasElevator: normalized.hasElevator || false,
      hasParking: normalized.hasParking || false,
      hasAirConditioning: normalized.hasAirConditioning || false,
      isPetFriendly: normalized.isPetFriendly,
      energyRating: normalized.energyRating as any,
      amenities: normalized.amenities || [],
      status: 'ACTIVE' as any,
    };

    if (existing) {
      // Track price change
      if (existing.price !== normalized.price) {
        await this.prisma.priceHistory.create({
          data: { listingId: existing.id, price: existing.price, currency: existing.currency },
        });
      }

      const updated = await this.prisma.listing.update({
        where: { id: existing.id },
        data: listingData,
        include: { location: true },
      });
      await this.searchService.indexListing(updated);
      return { created: false };
    } else {
      const slug = await this.generateUniqueSlug(normalized.title);
      const created = await this.prisma.listing.create({
        data: { ...listingData, slug, publishedAt: new Date() },
        include: { location: true },
      });

      // Create media records
      if (normalized.mediaUrls?.length) {
        await this.prisma.listingMedia.createMany({
          data: normalized.mediaUrls.slice(0, 20).map((url, i) => ({
            listingId: created.id,
            type: 'IMAGE' as any,
            url,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        });
      }

      await this.searchService.indexListing(created);
      return { created: true };
    }
  }

  async detectStaleListings() {
    // Mark listings not synced in 7 days as expired
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 7);

    const result = await this.prisma.listing.updateMany({
      where: {
        sourceConnector: { not: null },
        sourceLastSyncAt: { lt: staleDate },
        status: 'ACTIVE',
      },
      data: { status: 'EXPIRED' },
    });

    this.logger.log(`Marked ${result.count} stale listings as expired`);
    return result.count;
  }

  private async loadConnector(config: any): Promise<BaseConnector> {
    // Dynamic connector loading based on connectorType
    const { connectorType, config: connectorConfig } = config;
    const connectorMap: Record<string, () => Promise<any>> = {
      'spain-idealista': () => import('../../../../packages/connectors/src/spain/spain.connector').then(m => new m.SpainConnector(connectorConfig)),
      'uk-rightmove': () => import('../../../../packages/connectors/src/uk/uk.connector').then(m => new m.UKConnector(connectorConfig)),
      'us-reso-mls': () => import('../../../../packages/connectors/src/us/us.connector').then(m => new m.USConnector(connectorConfig)),
    };

    const loader = connectorMap[connectorType];
    if (!loader) throw new Error(`Unknown connector type: ${connectorType}`);
    return loader();
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title, { lower: true, strict: true }).substring(0, 80);
    let slug = base;
    let counter = 1;
    while (await this.prisma.listing.findUnique({ where: { slug } })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }
}
