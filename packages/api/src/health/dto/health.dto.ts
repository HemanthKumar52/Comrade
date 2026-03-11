import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVaccinationDto {
  @ApiProperty({ example: 'COVID-19' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Pfizer' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsOptional()
  @IsDateString()
  nextBoosterDue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificate?: string;
}

export class SaveInsuranceDto {
  @ApiProperty({ example: 'POL-12345' })
  @IsString()
  policyNumber: string;

  @ApiProperty({ example: 'ICICI Lombard' })
  @IsString()
  insurerName: string;

  @ApiPropertyOptional({ example: '+911800-123-456' })
  @IsOptional()
  @IsString()
  emergencyHelpline?: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  coverageStart: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  coverageEnd: string;

  @ApiPropertyOptional({ example: ['medical', 'trip-cancellation', 'baggage'] })
  @IsOptional()
  @IsString({ each: true })
  coverageTypes?: string[];
}
