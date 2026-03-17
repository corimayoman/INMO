import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InquiriesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: { listingId: string; name: string; email: string; phone?: string; message: string; userId?: string }) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: data.listingId },
      include: { agent: { include: { user: true } } },
    });

    const inquiry = await this.prisma.inquiry.create({
      data: {
        listingId: data.listingId,
        userId: data.userId,
        agentId: listing?.agentId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    });

    await this.prisma.listing.update({
      where: { id: data.listingId },
      data: { inquiryCount: { increment: 1 } },
    });

    this.eventEmitter.emit('inquiry.created', { inquiry, listing });
    return inquiry;
  }

  async getForAgent(agentId: string, status?: string) {
    return this.prisma.inquiry.findMany({
      where: { agentId, ...(status && { status: status as any }) },
      include: {
        listing: { include: { location: true, media: { where: { isPrimary: true }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, agentId: string) {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
