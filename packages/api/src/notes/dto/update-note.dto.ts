import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NoteTypeEnum } from './create-note.dto';

export class UpdateNoteDto {
  @ApiPropertyOptional({ enum: NoteTypeEnum, description: 'Note type' })
  @IsOptional()
  @IsEnum(NoteTypeEnum)
  type?: NoteTypeEnum;

  @ApiPropertyOptional({ description: 'Note title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Note content' })
  @IsOptional()
  @IsString()
  content?: string;

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
