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
import { HolidaysService } from './holidays.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Holidays')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get worldwide holidays happening today' })
  @ApiResponse({ status: 200, description: 'Holidays happening today across popular travel countries' })
  getHolidaysToday() {
    return this.holidaysService.getHolidaysToday();
  }

  @Get('upcoming/:countryCode')
  @ApiOperation({ summary: 'Get next upcoming holidays for a country' })
  @ApiParam({ name: 'countryCode', example: 'US', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiResponse({ status: 200, description: 'Upcoming public holidays' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  getUpcomingHolidays(@Param('countryCode') countryCode: string) {
    return this.holidaysService.getUpcomingHolidays(countryCode);
  }

  @Get('long-weekends/:countryCode/:year')
  @ApiOperation({ summary: 'Get long weekends for a country/year (great for trip planning!)' })
  @ApiParam({ name: 'countryCode', example: 'US', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiParam({ name: 'year', example: '2026', description: 'Year' })
  @ApiResponse({ status: 200, description: 'Long weekends for trip planning' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  getLongWeekends(
    @Param('countryCode') countryCode: string,
    @Param('year') year: string,
  ) {
    return this.holidaysService.getLongWeekends(countryCode, parseInt(year, 10));
  }

  @Get('check/:countryCode/:date')
  @ApiOperation({ summary: 'Check if a specific date is a holiday' })
  @ApiParam({ name: 'countryCode', example: 'US', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiParam({ name: 'date', example: '2026-12-25', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Holiday check result' })
  checkHoliday(
    @Param('countryCode') countryCode: string,
    @Param('date') date: string,
  ) {
    return this.holidaysService.checkHoliday(countryCode, date);
  }

  @Get(':countryCode/:year')
  @ApiOperation({ summary: 'Get public holidays for a country and year' })
  @ApiParam({ name: 'countryCode', example: 'US', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiParam({ name: 'year', example: '2026', description: 'Year' })
  @ApiResponse({ status: 200, description: 'Public holidays for the country/year' })
  @ApiResponse({ status: 404, description: 'Country or year not found' })
  getPublicHolidays(
    @Param('countryCode') countryCode: string,
    @Param('year') year: string,
  ) {
    return this.holidaysService.getPublicHolidays(countryCode, parseInt(year, 10));
  }
}
