import { IsString, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeneratePackingListDto {
  @ApiProperty({ example: 'Japan' })
  @IsString()
  destination: string;

  @ApiProperty({ example: 7 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'adventure' })
  @IsString()
  tripType: string;

  @ApiPropertyOptional({ example: ['hiking', 'swimming'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;
}

export class CreateItineraryDto {
  @ApiProperty()
  @IsUUID()
  tripId: string;

  @ApiProperty({
    example: [
      { day: 1, title: 'Arrival Day', activities: ['Check in to hotel', 'Explore neighborhood'] },
    ],
  })
  @IsArray()
  days: Array<{
    day: number;
    title: string;
    activities: string[];
    notes?: string;
  }>;
}
