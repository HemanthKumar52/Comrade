import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('AI Assistant')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('narrate/:tripId')
  @ApiOperation({ summary: 'Generate a narrative story from trip data' })
  @ApiParam({ name: 'tripId', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip narrative generated' })
  async narrateTrip(@Param('tripId') tripId: string) {
    return this.aiService.narrateTrip(tripId);
  }

  @Post('suggest-route')
  @ApiOperation({ summary: 'Suggest routes based on mood and duration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: { type: 'string', example: 'Mumbai' },
        mood: { type: 'string', example: 'adventurous', enum: ['peaceful', 'adventurous', 'foodie', 'cultural', 'budget', 'luxury'] },
        duration: { type: 'number', example: 5 },
      },
      required: ['from', 'mood', 'duration'],
    },
  })
  @ApiResponse({ status: 200, description: 'Suggested routes' })
  async suggestRoute(
    @Body() body: { from: string; mood: string; duration: number },
  ) {
    return this.aiService.suggestRoute(body.from, body.mood, body.duration);
  }

  @Post('mood-routes')
  @ApiOperation({ summary: 'Get mood-based routes from Indian cities' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mood: { type: 'string', example: 'peaceful' },
        from: { type: 'string', example: 'mumbai' },
      },
      required: ['mood', 'from'],
    },
  })
  @ApiResponse({ status: 200, description: 'Mood-based route suggestions' })
  async getMoodRoutes(@Body() body: { mood: string; from: string }) {
    return this.aiService.getMoodRoutes(body.mood, body.from);
  }

  @Post('travel-tips')
  @ApiOperation({ summary: 'Get AI-curated travel tips for a country' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        country: { type: 'string', example: 'IN' },
      },
      required: ['country'],
    },
  })
  @ApiResponse({ status: 200, description: 'Travel tips by category' })
  async getTravelTips(@Body() body: { country: string }) {
    return this.aiService.getTravelTips(body.country);
  }

  @Get('recommendations/:country')
  @ApiOperation({ summary: 'Get recommendations for what to see/do/eat/avoid' })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, JP, TH)' })
  @ApiResponse({ status: 200, description: 'Country recommendations' })
  async getRecommendations(@Param('country') country: string) {
    return this.aiService.getRecommendations(country);
  }
}
