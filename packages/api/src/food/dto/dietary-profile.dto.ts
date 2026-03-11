import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SetDietaryProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  vegetarian?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  vegan?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  halal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  kosher?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  glutenFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dairyFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  nutAllergy?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shellfishAllergy?: boolean;
}
