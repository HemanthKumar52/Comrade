import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
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
import { PartnersService } from './partners.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Partners')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for potential travel partners' })
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'vehicleType', required: false })
  @ApiQuery({ name: 'tripType', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated partner search results' })
  async search(
    @CurrentUser() user: JwtPayload,
    @Query('destination') destination?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('tripType') tripType?: string,
    @Query('language') language?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.partnersService.search(
      user.sub,
      { destination, dateFrom, dateTo, vehicleType, tripType, language },
      take ? parseInt(take, 10) : 20,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Post('request')
  @ApiOperation({ summary: 'Send a partner request' })
  @ApiResponse({ status: 201, description: 'Partner request sent' })
  async sendRequest(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRequestDto,
  ) {
    return this.partnersService.sendRequest(user.sub, dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List sent/received partner requests' })
  @ApiQuery({ name: 'type', required: false, enum: ['sent', 'received'] })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'List of partner requests' })
  async listRequests(
    @CurrentUser() user: JwtPayload,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.partnersService.listRequests(user.sub, type, status);
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Accept or decline a partner request' })
  @ApiResponse({ status: 200, description: 'Request updated' })
  async updateRequest(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { action: 'accept' | 'decline' },
  ) {
    return this.partnersService.updateRequest(id, user.sub, body.action);
  }

  @Get(':userId/profile')
  @ApiOperation({ summary: 'Get partner profile with stats, badges, reviews' })
  @ApiResponse({ status: 200, description: 'Partner profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPartnerProfile(@Param('userId') userId: string) {
    return this.partnersService.getPartnerProfile(userId);
  }

  @Post(':userId/review')
  @ApiOperation({ summary: 'Leave a review for a partner' })
  @ApiResponse({ status: 201, description: 'Review created' })
  async createReview(
    @Param('userId') userId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateReviewDto,
  ) {
    return this.partnersService.createReview(user.sub, userId, dto);
  }
}
