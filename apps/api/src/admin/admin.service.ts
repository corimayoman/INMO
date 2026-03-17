import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalListings, activeListings, totalInquiries, pendingReview] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count(),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.inquiry.count(),
      this.prisma.listing.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

    const recentListings = await this.prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { location: true, agent: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    const recentUsers = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    return { totalUsers, totalListings, activeListings, totalInquiries, pendingReview, recentListings, recentUsers };
  }

  async moderateListing(id: string, action: 'approve' | 'reject', reason?: string) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'ACTIVE' : 'REJECTED',
        publishedAt: action === 'approve' ? new Date() : undefined,
      },
    });
  }

  async getUsers(query: { page?: number; limit?: number; role?: string; search?: string }) {
    const { page = 1, limit = 20, role, search } = query;
    const where: any = {};
    if (role) where.role = role;
    if (search) where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
    ];

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);
    return { users, total, page, limit };
  }

  async banUser(id: string, reason: string) {
    return this.prisma.user.update({ where: { id }, data: { isBanned: true, bannedReason: reason } });
  }

  async getImportJobs(page = 1, limit = 20) {
    const [jobs, total] = await Promise.all([
      this.prisma.importJob.findMany({
        include: { connector: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.importJob.count(),
    ]);
    return { jobs, total, page, limit };
  }
}
