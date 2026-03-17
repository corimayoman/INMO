import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@Controller({ path: 'favorites', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorited properties' })
  async getFavorites(@Request() req: any) {
    return this.favoritesService.getFavorites(req.user.id);
  }

  @Post(':listingId')
  @ApiOperation({ summary: 'Toggle favorite on a listing' })
  async toggle(@Param('listingId') listingId: string, @Request() req: any) {
    return this.favoritesService.toggle(req.user.id, listingId);
  }

  @Get(':listingId/status')
  @ApiOperation({ summary: 'Check if listing is favorited' })
  async status(@Param('listingId') listingId: string, @Request() req: any) {
    return this.favoritesService.isFavorited(req.user.id, listingId);
  }
}
