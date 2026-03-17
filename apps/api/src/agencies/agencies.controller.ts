import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgenciesService } from './agencies.service';

@ApiTags('agencies')
@Controller({ path: 'agencies', version: '1' })
export class AgenciesController {
  constructor(private agenciesService: AgenciesService) {}

  @Get()
  @ApiOperation({ summary: 'List agencies' })
  async findAll(@Query() query: any) {
    return this.agenciesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get agency by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.agenciesService.findBySlug(slug);
  }
}
