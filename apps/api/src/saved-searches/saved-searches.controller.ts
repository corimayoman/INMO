import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavedSearchesService } from './saved-searches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('saved-searches')
@Controller({ path: 'saved-searches', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavedSearchesController {
  constructor(private savedSearchesService: SavedSearchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved searches' })
  async findAll(@Request() req: any) {
    return this.savedSearchesService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Save a search' })
  async create(@Request() req: any, @Body() body: any) {
    return this.savedSearchesService.create(req.user.id, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a saved search' })
  async update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.savedSearchesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved search' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.savedSearchesService.delete(id, req.user.id);
  }
}
