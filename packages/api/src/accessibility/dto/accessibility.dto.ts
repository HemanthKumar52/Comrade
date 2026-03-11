import { IsBoolean, IsOptional, IsArray, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SetAccessibilityProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  wheelchairUser?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visualImpairment?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hearingImpairment?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  seniorMode?: boolean;

  @ApiPropertyOptional({ example: ['diabetes', 'asthma'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalConditions?: string[];
}
