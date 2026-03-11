import { Module } from '@nestjs/common';
import { SafetyScoreController } from './safety-score.controller';
import { SafetyScoreService } from './safety-score.service';

@Module({
  controllers: [SafetyScoreController],
  providers: [SafetyScoreService],
  exports: [SafetyScoreService],
})
export class SafetyScoreModule {}
