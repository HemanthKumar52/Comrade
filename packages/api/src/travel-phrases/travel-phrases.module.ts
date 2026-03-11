import { Module } from '@nestjs/common';
import { TravelPhrasesController } from './travel-phrases.controller';
import { TravelPhrasesService } from './travel-phrases.service';

@Module({
  controllers: [TravelPhrasesController],
  providers: [TravelPhrasesService],
})
export class TravelPhrasesModule {}
