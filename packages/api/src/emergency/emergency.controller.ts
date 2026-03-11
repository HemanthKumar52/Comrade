import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
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
} from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import {
  TriggerSOSDto,
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
} from './dto/emergency.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Emergency')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('sos')
  @ApiOperation({ summary: 'Trigger SOS alert' })
  @ApiResponse({ status: 201, description: 'SOS triggered' })
  async triggerSOS(
    @CurrentUser() user: JwtPayload,
    @Body() dto: TriggerSOSDto,
  ) {
    return this.emergencyService.triggerSOS(user.sub, dto);
  }

  @Get('contacts')
  @ApiOperation({ summary: 'List emergency contacts' })
  @ApiResponse({ status: 200, description: 'Emergency contacts list' })
  async getContacts(@CurrentUser() user: JwtPayload) {
    return this.emergencyService.getContacts(user.sub);
  }

  @Post('contacts')
  @ApiOperation({ summary: 'Add emergency contact' })
  @ApiResponse({ status: 201, description: 'Contact added' })
  async addContact(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateEmergencyContactDto,
  ) {
    return this.emergencyService.addContact(user.sub, dto);
  }

  @Patch('contacts/:id')
  @ApiOperation({ summary: 'Update emergency contact' })
  @ApiResponse({ status: 200, description: 'Contact updated' })
  async updateContact(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateEmergencyContactDto,
  ) {
    return this.emergencyService.updateContact(id, user.sub, dto);
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete emergency contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted' })
  async deleteContact(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.emergencyService.deleteContact(id, user.sub);
  }

  @Get('embassies')
  @ApiOperation({ summary: 'Find embassies' })
  @ApiQuery({ name: 'country', required: true, example: 'US' })
  @ApiQuery({ name: 'homeCountry', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Embassy list' })
  async getEmbassies(
    @Query('country') country: string,
    @Query('homeCountry') homeCountry: string,
  ) {
    return this.emergencyService.getEmbassies(country, homeCountry);
  }

  @Get('advisories')
  @ApiOperation({ summary: 'Get travel advisories' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Travel advisory' })
  async getAdvisories(@Query('country') country: string) {
    return this.emergencyService.getAdvisories(country);
  }

  @Get('hospitals')
  @ApiOperation({ summary: 'Nearby hospitals' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Nearby medical facilities' })
  async getNearbyHospitals(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.emergencyService.getNearbyHospitals(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Get('emergency-numbers')
  @ApiOperation({ summary: 'Local emergency numbers' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Emergency phone numbers' })
  async getEmergencyNumbers(@Query('country') country: string) {
    return this.emergencyService.getEmergencyNumbers(country);
  }
}
