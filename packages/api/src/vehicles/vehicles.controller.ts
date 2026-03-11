import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Vehicle Rentals')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get all vehicle rental providers' })
  @ApiResponse({ status: 200, description: 'All rental providers' })
  async getAllProviders() {
    return this.vehiclesService.getAllProviders();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available vehicle types' })
  @ApiQuery({ name: 'country', required: false, description: 'ISO country code' })
  @ApiResponse({ status: 200, description: 'Available vehicle types' })
  async getVehicleTypes(@Query('country') country?: string) {
    return this.vehiclesService.getVehicleTypes(country);
  }

  @Get('estimate')
  @ApiOperation({ summary: 'Get estimated rental price' })
  @ApiQuery({ name: 'country', required: true, description: 'ISO country code' })
  @ApiQuery({ name: 'type', required: true, description: 'Vehicle type (car, motorcycle, scooter, etc.)' })
  @ApiQuery({ name: 'days', required: true, type: Number, description: 'Number of rental days' })
  @ApiResponse({ status: 200, description: 'Price estimate' })
  async getEstimatedPrice(
    @Query('country') country: string,
    @Query('type') type: string,
    @Query('days') days: string,
  ) {
    return this.vehiclesService.getEstimatedPrice(
      country,
      type,
      parseInt(days, 10),
    );
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Get vehicle rentals by country and optional type' })
  @ApiQuery({ name: 'country', required: false, description: 'ISO country code' })
  @ApiQuery({ name: 'type', required: false, description: 'Vehicle type' })
  @ApiResponse({ status: 200, description: 'Rental providers' })
  async getRentals(
    @Query('country') country?: string,
    @Query('type') type?: string,
  ) {
    if (type) {
      return this.vehiclesService.getRentalsByType(type, country);
    }
    if (country) {
      return this.vehiclesService.getRentalsByCountry(country);
    }
    return this.vehiclesService.getAllProviders();
  }

  @Get('rentals/:country')
  @ApiOperation({ summary: 'Get all vehicle rentals for a specific country' })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, US, JP)' })
  @ApiResponse({ status: 200, description: 'Country rental providers' })
  async getRentalsByCountry(@Param('country') country: string) {
    return this.vehiclesService.getRentalsByCountry(country);
  }
}
