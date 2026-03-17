import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LocationDto {
  @IsString() country: string;
  @IsString() countryCode: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() city: string;
  @IsOptional() @IsString() neighborhood?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() address?: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
}

export class CreateListingDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiProperty({ enum: ['SALE', 'RENT', 'SHORT_TERM', 'COMMERCIAL', 'LAND', 'NEW_DEVELOPMENT'] })
  @IsEnum(['SALE', 'RENT', 'SHORT_TERM', 'COMMERCIAL', 'LAND', 'NEW_DEVELOPMENT'])
  listingType: string;

  @ApiProperty({ enum: ['APARTMENT', 'HOUSE', 'VILLA', 'TOWNHOUSE', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'INDUSTRIAL', 'LAND', 'PARKING', 'OTHER'] })
  @IsEnum(['APARTMENT', 'HOUSE', 'VILLA', 'TOWNHOUSE', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'INDUSTRIAL', 'LAND', 'PARKING', 'OTHER'])
  propertyType: string;

  @ApiProperty() @ValidateNested() @Type(() => LocationDto) location: LocationDto;

  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() builtArea?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lotArea?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() bedrooms?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() bathrooms?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() parkingSpaces?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() yearBuilt?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFurnished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasPool?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasGarden?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasTerrace?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasBalcony?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasElevator?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasParking?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasAirConditioning?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPetFriendly?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() amenities?: string[];
}
