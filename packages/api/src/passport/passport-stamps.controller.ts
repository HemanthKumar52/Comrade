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
} from '@nestjs/swagger';
import { PassportStampsService } from './passport-stamps.service';
import { CreateStampDto } from './dto/passport-stamps.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Passport Stamps')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('passport')
export class PassportStampsController {
  constructor(
    private readonly passportStampsService: PassportStampsService,
  ) {}

  @Get('stamps')
  @ApiOperation({ summary: 'Get my passport stamps' })
  @ApiResponse({ status: 200, description: 'My stamps' })
  async getMyStamps(@CurrentUser() user: JwtPayload) {
    return this.passportStampsService.getMyStamps(user.sub);
  }

  @Post('stamps')
  @ApiOperation({ summary: 'Manually add a stamp' })
  @ApiResponse({ status: 201, description: 'Stamp added' })
  async addStamp(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStampDto,
  ) {
    return this.passportStampsService.addStamp(user.sub, dto);
  }

  @Get('stamps/:userId')
  @ApiOperation({ summary: "Get a user's stamps" })
  @ApiResponse({ status: 200, description: 'User stamps' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserStamps(@Param('userId') userId: string) {
    return this.passportStampsService.getUserStamps(userId);
  }

  @Post('stamps/auto/:tripId')
  @ApiOperation({ summary: 'Auto-generate stamp from completed trip' })
  @ApiResponse({ status: 201, description: 'Stamp generated' })
  @ApiResponse({ status: 404, description: 'Trip not found or not completed' })
  async autoGenerateStamp(
    @Param('tripId') tripId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.passportStampsService.autoGenerateStamp(tripId, user.sub);
  }
}
