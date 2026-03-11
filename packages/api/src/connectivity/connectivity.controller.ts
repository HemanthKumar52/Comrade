import {
  Controller,
  Get,
  Post,
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
import { ConnectivityService } from './connectivity.service';
import { SubmitWifiDto } from './dto/connectivity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Connectivity')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('connectivity')
export class ConnectivityController {
  constructor(private readonly connectivityService: ConnectivityService) {}

  @Get('wifi')
  @ApiOperation({ summary: 'Nearby WiFi hotspots' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 5 })
  @ApiResponse({ status: 200, description: 'WiFi hotspots' })
  async getNearbyWifi(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.connectivityService.getNearbyWifi(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
    );
  }

  @Post('wifi')
  @ApiOperation({ summary: 'Submit a WiFi hotspot' })
  @ApiResponse({ status: 201, description: 'Hotspot submitted' })
  async submitWifi(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitWifiDto,
  ) {
    return this.connectivityService.submitWifi(user.sub, dto);
  }

  @Get('sim-options')
  @ApiOperation({ summary: 'SIM/eSIM options for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'SIM options' })
  async getSIMOptions(@Query('country') country: string) {
    return this.connectivityService.getSIMOptions(country);
  }

  @Get('offline-content')
  @ApiOperation({ summary: 'Available offline content for a region' })
  @ApiQuery({ name: 'region', required: true, example: 'south-india' })
  @ApiResponse({ status: 200, description: 'Offline content catalog' })
  async getOfflineContent(@Query('region') region: string) {
    return this.connectivityService.getOfflineContent(region);
  }

  @Get('vpn-guide')
  @ApiOperation({ summary: 'VPN legality info for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'CN' })
  @ApiResponse({ status: 200, description: 'VPN guide' })
  async getVPNGuide(@Query('country') country: string) {
    return this.connectivityService.getVPNGuide(country);
  }
}
