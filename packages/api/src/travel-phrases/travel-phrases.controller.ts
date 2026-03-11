import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TravelPhrasesService } from './travel-phrases.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Travel Phrases')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('phrases')
export class TravelPhrasesController {
  constructor(private readonly phrasesService: TravelPhrasesService) {}

  @Get('languages')
  @ApiOperation({ summary: 'List all available languages' })
  @ApiResponse({ status: 200, description: 'Available languages' })
  async getLanguages() {
    return this.phrasesService.getLanguages();
  }

  @Get('essential/:country')
  @ApiOperation({ summary: "Get essential phrases for a country's primary language" })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, JP, FR)' })
  @ApiResponse({ status: 200, description: 'Essential phrases' })
  @ApiResponse({ status: 404, description: 'Country not supported' })
  async getEssentialPhrases(@Param('country') country: string) {
    return this.phrasesService.getEssentialPhrases(country.toUpperCase());
  }

  @Get(':language/:category')
  @ApiOperation({ summary: 'Get phrases for a language filtered by category' })
  @ApiParam({ name: 'language', description: 'Language name (e.g., hindi, japanese, french)' })
  @ApiParam({ name: 'category', description: 'Category (greetings, directions, food, emergency, transport)' })
  @ApiResponse({ status: 200, description: 'Phrases for language and category' })
  @ApiResponse({ status: 404, description: 'Language or category not found' })
  async getPhrasesByCategory(
    @Param('language') language: string,
    @Param('category') category: string,
  ) {
    return this.phrasesService.getPhrasesByCategory(
      language.toLowerCase(),
      category.toLowerCase(),
    );
  }

  @Get(':language')
  @ApiOperation({ summary: 'Get all phrases for a language' })
  @ApiParam({ name: 'language', description: 'Language name (e.g., hindi, japanese, french)' })
  @ApiResponse({ status: 200, description: 'All phrases for the language' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async getAllPhrases(@Param('language') language: string) {
    return this.phrasesService.getAllPhrases(language.toLowerCase());
  }
}
