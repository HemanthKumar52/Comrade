import { Module } from '@nestjs/common';
import { TravelGuidesController } from './travel-guides.controller';
import { TravelGuidesService } from './travel-guides.service';

@Module({
  controllers: [TravelGuidesController],
  providers: [TravelGuidesService],
  exports: [TravelGuidesService],
})
export class TravelGuidesModule {}
