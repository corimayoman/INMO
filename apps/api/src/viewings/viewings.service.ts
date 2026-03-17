import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ViewingsService {
  constructor(private prisma: PrismaService) {}

  async schedule(userId: string, data: { listingId: string; scheduledAt: Date; notes?: string }) {
    const listing = await this.prisma.listing.findUnique({ where: { id: data.listingId } });
    return this.prisma.viewing.create({
      data: { userId, agentId: listing?.agentId, ...data },
    });
  }

  async getForUser(userId: string) {
    return this.prisma.viewing.findMany({
      where: { userId },
      include: { listing: { include: { location: true, media: { where: { isPrimary: true }, take: 1 } } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getForAgent(agentId: string) {
    return this.prisma.viewing.findMany({
      where: { agentId },
      include: { listing: { include: { location: true } }, user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async confirm(id: string) {
    return this.prisma.viewing.update({ where: { id }, data: { confirmed: true } });
  }

  async cancel(id: string) {
    return this.prisma.viewing.update({ where: { id }, data: { cancelled: true } });
  }
}
