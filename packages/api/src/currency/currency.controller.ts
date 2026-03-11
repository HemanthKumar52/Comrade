import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
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
import { CurrencyService } from './currency.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/create-budget.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Currency')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get exchange rate' })
  @ApiQuery({ name: 'from', required: true, example: 'USD' })
  @ApiQuery({ name: 'to', required: true, example: 'INR' })
  @ApiResponse({ status: 200, description: 'Exchange rate' })
  async getRate(@Query('from') from: string, @Query('to') to: string) {
    return this.currencyService.getRate(from, to);
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convert currency amount' })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  @ApiQuery({ name: 'from', required: true, example: 'USD' })
  @ApiQuery({ name: 'to', required: true, example: 'INR' })
  @ApiResponse({ status: 200, description: 'Converted amount' })
  async convert(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.currencyService.convert(parseFloat(amount), from, to);
  }

  @Get('all')
  @ApiOperation({ summary: 'List all common currencies' })
  @ApiResponse({ status: 200, description: 'Currency list' })
  async getAll() {
    return this.currencyService.getAllCurrencies();
  }

  @Get('historical')
  @ApiOperation({ summary: 'Historical exchange rates' })
  @ApiQuery({ name: 'from', required: true, example: 'USD' })
  @ApiQuery({ name: 'to', required: true, example: 'INR' })
  @ApiQuery({ name: 'days', required: true, type: Number, example: 30 })
  @ApiResponse({ status: 200, description: 'Historical rates' })
  async getHistorical(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('days') days: string,
  ) {
    return this.currencyService.getHistorical(from, to, parseInt(days, 10));
  }

  @Post('budget')
  @ApiOperation({ summary: 'Create trip budget' })
  @ApiResponse({ status: 201, description: 'Budget created' })
  async createBudget(@Body() dto: CreateBudgetDto) {
    return this.currencyService.createBudget(dto);
  }

  @Get('budget/:tripId')
  @ApiOperation({ summary: 'Get trip budget' })
  @ApiResponse({ status: 200, description: 'Trip budget with categories' })
  async getBudget(@Param('tripId') tripId: string) {
    return this.currencyService.getBudget(tripId);
  }

  @Patch('budget/:id')
  @ApiOperation({ summary: 'Update budget' })
  @ApiResponse({ status: 200, description: 'Budget updated' })
  async updateBudget(
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.currencyService.updateBudget(id, dto);
  }
}
