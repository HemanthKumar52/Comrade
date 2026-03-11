import {
  Controller,
  Get,
  Put,
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
import { AccessibilityService } from './accessibility.service';
import { SetAccessibilityProfileDto } from './dto/accessibility.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Accessibility')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('accessibility')
export class AccessibilityController {
  constructor(private readonly accessibilityService: AccessibilityService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get my accessibility profile' })
  @ApiResponse({ status: 200, description: 'Accessibility profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.accessibilityService.getProfile(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Set accessibility profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async setProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SetAccessibilityProfileDto,
  ) {
    return this.accessibilityService.setProfile(user.sub, dto);
  }

  @Get('pois')
  @ApiOperation({ summary: 'Accessible POIs nearby' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 5 })
  @ApiResponse({ status: 200, description: 'Accessible POIs' })
  async getAccessiblePOIs(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.accessibilityService.getAccessiblePOIs(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
    );
  }

  @Get('routes')
  @ApiOperation({ summary: 'Wheelchair accessible route' })
  @ApiQuery({ name: 'sourceLat', required: true, type: Number })
  @ApiQuery({ name: 'sourceLng', required: true, type: Number })
  @ApiQuery({ name: 'destLat', required: true, type: Number })
  @ApiQuery({ name: 'destLng', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Accessible route' })
  async getAccessibleRoute(
    @Query('sourceLat') sourceLat: string,
    @Query('sourceLng') sourceLng: string,
    @Query('destLat') destLat: string,
    @Query('destLng') destLng: string,
  ) {
    return this.accessibilityService.getAccessibleRoute(
      parseFloat(sourceLat),
      parseFloat(sourceLng),
      parseFloat(destLat),
      parseFloat(destLng),
    );
  }
}
