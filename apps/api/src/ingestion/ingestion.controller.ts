import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin/ingestion')
@Controller({ path: 'admin/ingestion', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MODERATOR')
@ApiBearerAuth()
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  @Post('connectors/:id/run')
  @ApiOperation({ summary: 'Manually trigger a connector run' })
  async runConnector(@Param('id') id: string) {
    await this.ingestionService.runConnector(id);
    return { message: 'Connector run triggered' };
  }

  @Post('detect-stale')
  @ApiOperation({ summary: 'Detect and mark stale listings' })
  async detectStale() {
    const count = await this.ingestionService.detectStaleListings();
    return { markedStale: count };
  }
}
