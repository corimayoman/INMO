import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, emailVerified: true, role: true,
        firstName: true, lastName: true, phone: true, avatarUrl: true,
        preferredLanguage: true, preferredCurrency: true, preferredUnits: true,
        mfaEnabled: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        preferredLanguage: data.preferredLanguage,
        preferredCurrency: data.preferredCurrency,
        preferredUnits: data.preferredUnits,
      },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, preferredLanguage: true, preferredCurrency: true, preferredUnits: true,
      },
    });
  }

  async getRecentlyViewed(userId: string) {
    return this.prisma.recentlyViewed.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            location: true,
            media: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 20,
    });
  }

  async trackView(userId: string, listingId: string) {
    await this.prisma.recentlyViewed.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId },
      update: { viewedAt: new Date() },
    });
  }
}
