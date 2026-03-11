import { Module } from '@nestjs/common';
import { TravelKitController } from './travel-kit.controller';
import { TravelKitService } from './travel-kit.service';

@Module({
  controllers: [TravelKitController],
  providers: [TravelKitService],
  exports: [TravelKitService],
})
export class TravelKitModule {}
