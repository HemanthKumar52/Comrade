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
import { FoodService } from './food.service';
import { SetDietaryProfileDto } from './dto/dietary-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Food & Dietary')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('dishes')
  @ApiOperation({ summary: 'Get local dishes for a country/region' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiQuery({ name: 'region', required: false, example: 'Tamil Nadu' })
  @ApiResponse({ status: 200, description: 'Local dishes' })
  async getDishes(
    @Query('country') country: string,
    @Query('region') region?: string,
  ) {
    return this.foodService.getDishes(country, region);
  }

  @Get('water-safety')
  @ApiOperation({ summary: 'Get water safety info for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Water safety information' })
  async getWaterSafety(@Query('country') country: string) {
    return this.foodService.getWaterSafety(country);
  }

  @Get('dietary-profile')
  @ApiOperation({ summary: 'Get user dietary profile' })
  @ApiResponse({ status: 200, description: 'Dietary profile' })
  async getDietaryProfile(@CurrentUser() user: JwtPayload) {
    return this.foodService.getDietaryProfile(user.sub);
  }

  @Put('dietary-profile')
  @ApiOperation({ summary: 'Set dietary profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async setDietaryProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SetDietaryProfileDto,
  ) {
    return this.foodService.setDietaryProfile(user.sub, dto);
  }

  @Get('restaurants')
  @ApiOperation({ summary: 'Nearby restaurants filtered by dietary needs' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 5 })
  @ApiQuery({ name: 'dietary', required: false, example: 'vegan' })
  @ApiResponse({ status: 200, description: 'Filtered restaurants' })
  async getRestaurants(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('dietary') dietary?: string,
  ) {
    return this.foodService.getRestaurants(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
      dietary,
    );
  }
}
