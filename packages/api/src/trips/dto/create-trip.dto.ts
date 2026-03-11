import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TravelerTypeEnum {
  SOLO = 'SOLO',
  DUO = 'DUO',
  SQUAD = 'SQUAD',
  GROUP = 'GROUP',
}

export enum VehicleTypeEnum {
  CAR = 'CAR',
  BIKE = 'BIKE',
  BUS = 'BUS',
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT',
  TREK = 'TREK',
  BICYCLE = 'BICYCLE',
  AUTO = 'AUTO',
}

export class CreateTripDto {
  @ApiProperty({ description: 'Trip title' })
  @IsString()
  title: string;

  @ApiProperty({ enum: TravelerTypeEnum, description: 'Trip type' })
  @IsEnum(TravelerTypeEnum)
  type: TravelerTypeEnum;

  @ApiProperty({ description: 'Source location name' })
  @IsString()
  source: string;

  @ApiProperty({ description: 'Destination location name' })
  @IsString()
  destination: string;

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

  @ApiPropertyOptional({ description: 'Route mode (driving, walking, cycling)' })
  @IsOptional()
  @IsString()
  routeMode?: string;
}
