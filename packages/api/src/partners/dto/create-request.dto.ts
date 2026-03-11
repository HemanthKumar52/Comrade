import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ description: 'Target user ID' })
  @IsUUID()
  toUserId: string;

  @ApiPropertyOptional({ description: 'Associated trip ID' })
  @IsOptional()
  @IsUUID()
  tripId?: string;

  @ApiPropertyOptional({ description: 'Message to the partner' })
  @IsOptional()
  @IsString()
  message?: string;
}
