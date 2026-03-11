import {
  Controller,
  Get,
  Post,
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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, CreateSplitsDto } from './dto/expenses.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Log an expense' })
  @ApiResponse({ status: 201, description: 'Expense created' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List trip expenses' })
  @ApiQuery({ name: 'tripId', required: true })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated expenses' })
  async list(
    @Query('tripId') tripId: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.expensesService.listByTrip(
      tripId,
      take ? parseInt(take, 10) : 50,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Trip expense summary by category' })
  @ApiQuery({ name: 'tripId', required: true })
  @ApiResponse({ status: 200, description: 'Expense summary' })
  async getSummary(@Query('tripId') tripId: string) {
    return this.expensesService.getSummary(tripId);
  }

  @Post(':id/split')
  @ApiOperation({ summary: 'Create expense splits' })
  @ApiResponse({ status: 201, description: 'Splits created' })
  async createSplits(
    @Param('id') id: string,
    @Body() dto: CreateSplitsDto,
  ) {
    return this.expensesService.createSplits(id, dto);
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Calculate minimum settlements' })
  @ApiQuery({ name: 'tripId', required: true })
  @ApiResponse({ status: 200, description: 'Settlement plan' })
  async getSettlements(@Query('tripId') tripId: string) {
    return this.expensesService.getSettlements(tripId);
  }

  @Get('report')
  @ApiOperation({ summary: 'Full finance report' })
  @ApiQuery({ name: 'tripId', required: true })
  @ApiResponse({ status: 200, description: 'Full finance report' })
  async getReport(@Query('tripId') tripId: string) {
    return this.expensesService.getReport(tripId);
  }
}
