import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Trips')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTripDto,
  ) {
    return this.tripsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user trips' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by trip status' })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of trips' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.tripsService.findAll(
      user.sub,
      status,
      take ? parseInt(take, 10) : 20,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip detail' })
  @ApiResponse({ status: 200, description: 'Trip with members and route logs' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip' })
  @ApiResponse({ status: 200, description: 'Trip updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete trip (set CANCELLED)' })
  @ApiResponse({ status: 200, description: 'Trip cancelled' })
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tripsService.softDelete(id, user.sub);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a trip' })
  @ApiResponse({ status: 200, description: 'Trip started' })
  async startTrip(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tripsService.startTrip(id, user.sub);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End a trip and trigger badge check' })
  @ApiResponse({ status: 200, description: 'Trip completed' })
  async endTrip(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tripsService.endTrip(id, user.sub);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the trip' })
  @ApiResponse({ status: 201, description: 'Member added' })
  async addMember(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.tripsService.addMember(id, user.sub, body.userId, body.role || 'MEMBER');
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from the trip' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') memberId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tripsService.removeMember(id, user.sub, memberId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get trip statistics' })
  @ApiResponse({ status: 200, description: 'Trip statistics' })
  async getTripStats(@Param('id') id: string) {
    return this.tripsService.getTripStats(id);
  }
}
