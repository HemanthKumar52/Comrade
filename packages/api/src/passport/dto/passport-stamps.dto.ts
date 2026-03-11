import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStampDto {
  @ApiProperty({ example: 'Tokyo, Japan' })
  @IsString()
  destination: string;

  @ApiPropertyOptional({ example: 'JP' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artworkUrl?: string;
}
