import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ViewingsService } from './viewings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('viewings')
@Controller({ path: 'viewings', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ViewingsController {
  constructor(private viewingsService: ViewingsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a viewing' })
  async schedule(@Request() req: any, @Body() body: any) {
    return this.viewingsService.schedule(req.user.id, body);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my scheduled viewings' })
  async getForUser(@Request() req: any) {
    return this.viewingsService.getForUser(req.user.id);
  }

  @Get('agent')
  @ApiOperation({ summary: 'Get viewings for agent' })
  async getForAgent(@Request() req: any) {
    return this.viewingsService.getForAgent(req.user.agent?.id);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.viewingsService.confirm(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.viewingsService.cancel(id);
  }
}
