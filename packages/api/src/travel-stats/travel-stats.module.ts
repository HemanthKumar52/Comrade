import { Module } from '@nestjs/common';
import { TravelStatsController } from './travel-stats.controller';
import { TravelStatsService } from './travel-stats.service';

@Module({
  controllers: [TravelStatsController],
  providers: [TravelStatsService],
})
export class TravelStatsModule {}
