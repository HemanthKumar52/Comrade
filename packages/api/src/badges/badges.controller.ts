import {
  Controller,
  Get,
  Post,
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
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Badges')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'List all badges' })
  @ApiQuery({ name: 'family', required: false, description: 'Filter by badge family' })
  @ApiResponse({ status: 200, description: 'List of all badges' })
  async getAllBadges(@Query('family') family?: string) {
    return this.badgesService.getAllBadges(family);
  }

  @Get('my')
  @ApiOperation({ summary: "Get current user's unlocked badges" })
  @ApiResponse({ status: 200, description: 'User unlocked badges' })
  async getMyBadges(@CurrentUser() user: JwtPayload) {
    return this.badgesService.getUserBadges(user.sub);
  }

  @Post('check')
  @ApiOperation({ summary: 'Trigger badge check for current user' })
  @ApiResponse({ status: 200, description: 'Newly awarded badge names' })
  async checkBadges(@CurrentUser() user: JwtPayload) {
    const awarded = await this.badgesService.checkAndAwardBadges(user.sub);
    return { awarded };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get badge detail' })
  @ApiResponse({ status: 200, description: 'Badge detail with unlock count' })
  @ApiResponse({ status: 404, description: 'Badge not found' })
  async getBadgeDetail(@Param('id') id: string) {
    return this.badgesService.getBadgeDetail(id);
  }
}
