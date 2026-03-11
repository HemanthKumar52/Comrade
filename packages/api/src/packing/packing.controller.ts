import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PackingService } from './packing.service';
import { GeneratePackingListDto, CreateItineraryDto } from './dto/packing.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Packing & Planning')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI packing list' })
  @ApiResponse({ status: 201, description: 'Generated packing list' })
  async generate(@Body() dto: GeneratePackingListDto) {
    return this.packingService.generatePackingList(dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get reusable packing templates' })
  @ApiResponse({ status: 200, description: 'Packing templates' })
  async getTemplates() {
    return this.packingService.getTemplates();
  }

  @Post('itinerary')
  @ApiOperation({ summary: 'Create day-by-day itinerary' })
  @ApiResponse({ status: 201, description: 'Itinerary created' })
  async createItinerary(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateItineraryDto,
  ) {
    return this.packingService.createItinerary(user.sub, dto);
  }

  @Get('itinerary/:tripId')
  @ApiOperation({ summary: 'Get trip itinerary' })
  @ApiResponse({ status: 200, description: 'Trip itinerary' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  async getItinerary(@Param('tripId') tripId: string) {
    return this.packingService.getItinerary(tripId);
  }
}
