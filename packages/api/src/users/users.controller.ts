import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get own profile with stats' })
  @ApiResponse({ status: 200, description: 'User profile with stats' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get full dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard with stats, recent trips, badges, streak' })
  async getDashboard(@CurrentUser() user: JwtPayload) {
    return this.usersService.getDashboard(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user public profile' })
  @ApiResponse({ status: 200, description: 'Public profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPublic(@Param('id') id: string) {
    return this.usersService.getUserPublic(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user travel stats' })
  @ApiResponse({ status: 200, description: 'User travel statistics' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @Get(':id/badges')
  @ApiOperation({ summary: 'Get user badges' })
  @ApiResponse({ status: 200, description: 'List of user badges with unlock dates' })
  async getUserBadges(@Param('id') id: string) {
    return this.usersService.getUserBadges(id);
  }
}
