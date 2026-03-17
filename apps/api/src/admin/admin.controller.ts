import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MODERATOR')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  async getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  async banUser(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.banUser(id, reason);
  }

  @Patch('listings/:id/moderate')
  @ApiOperation({ summary: 'Approve or reject a listing' })
  async moderateListing(@Param('id') id: string, @Body() body: { action: 'approve' | 'reject'; reason?: string }) {
    return this.adminService.moderateListing(id, body.action, body.reason);
  }

  @Get('import-jobs')
  @ApiOperation({ summary: 'Get import job history' })
  async getImportJobs(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adminService.getImportJobs(page, limit);
  }
}
