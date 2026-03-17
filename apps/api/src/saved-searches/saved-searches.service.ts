import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; filters: any; alertEnabled?: boolean; alertFrequency?: string }) {
    return this.prisma.savedSearch.create({
      data: { userId, ...data },
    });
  }

  async findAll(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.savedSearch.deleteMany({ where: { id, userId } });
  }

  async update(id: string, userId: string, data: any) {
    return this.prisma.savedSearch.updateMany({
      where: { id, userId },
      data,
    });
  }
}
