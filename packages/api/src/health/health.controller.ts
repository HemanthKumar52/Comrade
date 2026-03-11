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
import { HealthService } from './health.service';
import { CreateVaccinationDto, SaveInsuranceDto } from './dto/health.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Health & Vaccination')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('vaccinations/required')
  @ApiOperation({ summary: 'Required vaccines for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'KE' })
  @ApiResponse({ status: 200, description: 'Vaccination requirements' })
  async getRequired(@Query('country') country: string) {
    return this.healthService.getRequiredVaccinations(country);
  }

  @Post('vaccinations')
  @ApiOperation({ summary: 'Log a personal vaccination' })
  @ApiResponse({ status: 201, description: 'Vaccination logged' })
  async logVaccination(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateVaccinationDto,
  ) {
    return this.healthService.logVaccination(user.sub, dto);
  }

  @Get('vaccinations/my')
  @ApiOperation({ summary: 'Get my vaccination records' })
  @ApiResponse({ status: 200, description: 'Vaccination records' })
  async getMyVaccinations(@CurrentUser() user: JwtPayload) {
    return this.healthService.getMyVaccinations(user.sub);
  }

  @Post('insurance')
  @ApiOperation({ summary: 'Save insurance info' })
  @ApiResponse({ status: 201, description: 'Insurance saved' })
  async saveInsurance(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SaveInsuranceDto,
  ) {
    return this.healthService.saveInsurance(user.sub, dto);
  }

  @Get('insurance')
  @ApiOperation({ summary: 'Get my insurance' })
  @ApiResponse({ status: 200, description: 'Insurance info' })
  async getInsurance(@CurrentUser() user: JwtPayload) {
    return this.healthService.getInsurance(user.sub);
  }

  @Get('pharmacies')
  @ApiOperation({ summary: 'Nearby pharmacies' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 5 })
  @ApiResponse({ status: 200, description: 'Nearby pharmacies' })
  async getNearbyPharmacies(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.healthService.getNearbyPharmacies(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
    );
  }

  @Get('drug-translator')
  @ApiOperation({ summary: 'Find drug equivalent name in another country' })
  @ApiQuery({ name: 'name', required: true, example: 'Paracetamol' })
  @ApiQuery({ name: 'country', required: true, example: 'US' })
  @ApiResponse({ status: 200, description: 'Drug equivalent' })
  async getDrugTranslation(
    @Query('name') name: string,
    @Query('country') country: string,
  ) {
    return this.healthService.getDrugTranslation(name, country);
  }
}
