import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgenciesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { country?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, country } = query;
    const where = { isActive: true, ...(country && { country }) };
    const [agencies, total] = await Promise.all([
      this.prisma.agency.findMany({ where, skip: (page - 1) * limit, take: limit }),
      this.prisma.agency.count({ where }),
    ]);
    return { agencies, total, page, limit };
  }

  async findBySlug(slug: string) {
    const agency = await this.prisma.agency.findUnique({
      where: { slug },
      include: {
        agents: { include: { user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } } } },
        listings: { where: { status: 'ACTIVE' }, take: 6, include: { location: true, media: { where: { isPrimary: true }, take: 1 } } },
      },
    });
    if (!agency) throw new NotFoundException('Agency not found');
    return agency;
  }

  async getStats(agencyId: string) {
    const [totalListings, activeListings, totalInquiries] = await Promise.all([
      this.prisma.listing.count({ where: { agencyId } }),
      this.prisma.listing.count({ where: { agencyId, status: 'ACTIVE' } }),
      this.prisma.inquiry.count({ where: { listing: { agencyId } } }),
    ]);
    return { totalListings, activeListings, totalInquiries };
  }
}
