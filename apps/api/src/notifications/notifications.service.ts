import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { type: string; title: string; body: string; data?: any }) {
    return this.prisma.notification.create({
      data: { userId, type: data.type as any, title: data.title, body: data.body, data: data.data },
    });
  }

  async getForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  @OnEvent('inquiry.created')
  async handleInquiryCreated({ inquiry, listing }: any) {
    if (listing?.agent?.userId) {
      await this.create(listing.agent.userId, {
        type: 'IN_APP',
        title: 'New inquiry received',
        body: `${inquiry.name} is interested in your listing`,
        data: { inquiryId: inquiry.id, listingId: listing.id },
      });
    }
  }
}
