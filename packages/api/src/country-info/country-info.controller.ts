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
import { CountryInfoService } from './country-info.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Country Info')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('country-info')
export class CountryInfoController {
  constructor(private readonly countryInfoService: CountryInfoService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search countries by name' })
  @ApiQuery({ name: 'q', required: true, example: 'japan', description: 'Country name to search' })
  @ApiResponse({ status: 200, description: 'List of matching countries' })
  searchCountries(@Query('q') query: string) {
    return this.countryInfoService.searchCountries(query);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare multiple countries side-by-side' })
  @ApiQuery({ name: 'countries', required: true, example: 'IN,JP,US', description: 'Comma-separated country codes' })
  @ApiResponse({ status: 200, description: 'Side-by-side country comparison' })
  compareCountries(@Query('countries') countries: string) {
    const codes = countries.split(',').map((c) => c.trim()).filter(Boolean);
    return this.countryInfoService.compareCountries(codes);
  }

  @Get('region/:region')
  @ApiOperation({ summary: 'Get countries by region' })
  @ApiParam({ name: 'region', example: 'asia', description: 'Region name (asia, europe, africa, americas, oceania)' })
  @ApiResponse({ status: 200, description: 'List of countries in the region' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  getCountriesByRegion(@Param('region') region: string) {
    return this.countryInfoService.getCountriesByRegion(region);
  }

  @Get('neighbors/:code')
  @ApiOperation({ summary: 'Get bordering countries with full info' })
  @ApiParam({ name: 'code', example: 'IN', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiResponse({ status: 200, description: 'Neighboring countries with details' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  getNeighbors(@Param('code') code: string) {
    return this.countryInfoService.getNeighbors(code);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get full country info by code' })
  @ApiParam({ name: 'code', example: 'IN', description: 'ISO 3166-1 alpha-2 or alpha-3 country code' })
  @ApiResponse({ status: 200, description: 'Full country information including flag, capital, population, languages, currencies, timezones, borders, driving side' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  getCountryByCode(@Param('code') code: string) {
    return this.countryInfoService.getCountryByCode(code);
  }
}
