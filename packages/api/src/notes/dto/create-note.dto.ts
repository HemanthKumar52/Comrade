import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NoteTypeEnum {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  PHOTO = 'PHOTO',
  PLAN = 'PLAN',
}

export class CreateNoteDto {
  @ApiProperty({ enum: NoteTypeEnum, description: 'Note type' })
  @IsEnum(NoteTypeEnum)
  type: NoteTypeEnum;

  @ApiPropertyOptional({ description: 'Note title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Note content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Associated trip ID' })
  @IsOptional()
  @IsUUID()
  tripId?: string;

  @ApiPropertyOptional({ description: 'Tags array', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Geo point {lat, lng}' })
  @IsOptional()
  @IsObject()
  geoPoint?: { lat: number; lng: number };

  @ApiPropertyOptional({ description: 'Folder ID' })
  @IsOptional()
  @IsUUID()
  folderId?: string;
}
