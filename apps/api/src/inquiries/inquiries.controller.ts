import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';

@ApiTags('inquiries')
@Controller({ path: 'inquiries', version: '1' })
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Submit a property inquiry' })
  async create(@Body() body: any, @Request() req: any) {
    return this.inquiriesService.create({ ...body, userId: req.user?.id });
  }

  @Get('agent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiries for current agent' })
  async getForAgent(@Request() req: any, @Query('status') status?: string) {
    return this.inquiriesService.getForAgent(req.user.agent?.id, status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req: any) {
    return this.inquiriesService.updateStatus(id, status, req.user.agent?.id);
  }
}
