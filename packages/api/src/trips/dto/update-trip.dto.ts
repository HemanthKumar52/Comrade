import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleTypeEnum, TravelerTypeEnum } from './create-trip.dto';

export class UpdateTripDto {
  @ApiPropertyOptional({ description: 'Trip title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: TravelerTypeEnum, description: 'Trip type' })
  @IsOptional()
  @IsEnum(TravelerTypeEnum)
  type?: TravelerTypeEnum;

  @ApiPropertyOptional({ description: 'Source location name' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Destination location name' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({ description: 'Source coordinates {lat, lng}' })
  @IsOptional()
  @IsObject()
  sourceCoords?: { lat: number; lng: number };

  @ApiPropertyOptional({ description: 'Destination coordinates {lat, lng}' })
  @IsOptional()
  @IsObject()
  destCoords?: { lat: number; lng: number };

  @ApiPropertyOptional({ enum: VehicleTypeEnum, description: 'Vehicle type' })
  @IsOptional()
  @IsEnum(VehicleTypeEnum)
  vehicleType?: VehicleTypeEnum;

  @ApiPropertyOptional({ description: 'Route mode' })
  @IsOptional()
  @IsString()
  routeMode?: string;
}
