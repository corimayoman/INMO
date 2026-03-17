import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            location: true,
            media: { where: { isPrimary: true }, take: 1 },
            agency: { select: { id: true, name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggle(userId: string, listingId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_listingId: { userId, listingId } } });
      await this.prisma.listing.update({ where: { id: listingId }, data: { favoriteCount: { decrement: 1 } } });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({ data: { userId, listingId } });
      await this.prisma.listing.update({ where: { id: listingId }, data: { favoriteCount: { increment: 1 } } });
      return { favorited: true };
    }
  }

  async isFavorited(userId: string, listingId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });
    return { favorited: !!fav };
  }
}
