import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';

@ApiTags('listings')
@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Search/list properties' })
  async findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get property by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.listingsService.findBySlug(slug);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar properties' })
  async getSimilar(@Param('id') id: string) {
    return this.listingsService.getSimilar(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  async create(@Body() dto: CreateListingDto, @Request() req: any) {
    return this.listingsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  async update(@Param('id') id: string, @Body() dto: UpdateListingDto, @Request() req: any) {
    return this.listingsService.update(id, dto, req.user.id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a listing' })
  async publish(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.publish(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete (archive) a listing' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.delete(id, req.user.id);
  }
}
