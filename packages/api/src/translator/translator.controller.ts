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
import { TranslatorService } from './translator.service';
import { TranslateDto, DetectLanguageDto } from './dto/translate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Translator')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Post('translate')
  @ApiOperation({ summary: 'Translate text' })
  @ApiResponse({ status: 200, description: 'Translated text' })
  async translate(@Body() dto: TranslateDto) {
    return this.translatorService.translate(
      dto.text,
      dto.sourceLang,
      dto.targetLang,
    );
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect language of text' })
  @ApiResponse({ status: 200, description: 'Detected language' })
  async detect(@Body() dto: DetectLanguageDto) {
    return this.translatorService.detectLanguage(dto.text);
  }

  @Get('languages')
  @ApiOperation({ summary: 'List available languages' })
  @ApiResponse({ status: 200, description: 'List of supported languages' })
  async getLanguages() {
    return this.translatorService.getLanguages();
  }

  @Get('language-packs')
  @ApiOperation({ summary: 'Available offline language packs' })
  @ApiResponse({ status: 200, description: 'Language packs list' })
  async getLanguagePacks() {
    return this.translatorService.getLanguagePacks();
  }

  @Get('phrasebook')
  @ApiOperation({ summary: 'Get phrases for a language' })
  @ApiQuery({ name: 'lang', required: true, example: 'hi' })
  @ApiQuery({ name: 'category', required: false, example: 'greetings' })
  @ApiResponse({ status: 200, description: 'Phrasebook entries' })
  async getPhrasebook(
    @Query('lang') lang: string,
    @Query('category') category?: string,
  ) {
    return this.translatorService.getPhrasebook(lang, category);
  }
}
