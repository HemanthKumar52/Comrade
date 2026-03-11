import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum POICategoryEnum {
  TEA_SHOP = 'TEA_SHOP',
  HOTEL = 'HOTEL',
  HOSTEL = 'HOSTEL',
  RESTAURANT = 'RESTAURANT',
  HISTORIC = 'HISTORIC',
  PETROL = 'PETROL',
  ATM = 'ATM',
  PHARMACY = 'PHARMACY',
  SCENIC = 'SCENIC',
  TRAILHEAD = 'TRAILHEAD',
  WIFI_HOTSPOT = 'WIFI_HOTSPOT',
  HOSPITAL = 'HOSPITAL',
  EMBASSY = 'EMBASSY',
  RELIGIOUS = 'RELIGIOUS',
}

export class CreatePoiDto {
  @ApiProperty({ description: 'POI name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: POICategoryEnum, description: 'POI category' })
  @IsEnum(POICategoryEnum)
  category: POICategoryEnum;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Latitude', type: Number })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude', type: Number })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Photos JSON' })
  @IsOptional()
  @IsObject()
  photos?: any;

  @ApiPropertyOptional({ description: 'Amenities list', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Opening hours JSON' })
  @IsOptional()
  @IsObject()
  openingHours?: any;

  @ApiPropertyOptional({ description: 'Price range' })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({ description: 'Wheelchair accessible' })
  @IsOptional()
  @IsBoolean()
  wheelchairAccessible?: boolean;

  @ApiPropertyOptional({ description: 'Dietary options', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryOptions?: string[];

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;
}
