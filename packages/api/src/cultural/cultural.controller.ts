import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CulturalService } from './cultural.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Cultural Intelligence')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cultural')
export class CulturalController {
  constructor(private readonly culturalService: CulturalService) {}

  @Get('guide')
  @ApiOperation({ summary: 'Get culture card for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'JP' })
  @ApiResponse({ status: 200, description: 'Culture card' })
  async getCultureCard(@Query('country') country: string) {
    return this.culturalService.getCultureCard(country);
  }

  @Get('etiquette')
  @ApiOperation({ summary: 'Get religious site etiquette' })
  @ApiQuery({ name: 'siteType', required: true, example: 'mosque' })
  @ApiQuery({ name: 'country', required: false, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Etiquette rules' })
  async getEtiquette(
    @Query('siteType') siteType: string,
    @Query('country') country?: string,
  ) {
    return this.culturalService.getEtiquette(siteType, country);
  }

  @Get('phrases')
  @ApiOperation({ summary: 'Common polite phrases for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'JP' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Common phrases' })
  async getPhrases(
    @Query('country') country: string,
    @Query('limit') limit?: string,
  ) {
    return this.culturalService.getPhrases(
      country,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
