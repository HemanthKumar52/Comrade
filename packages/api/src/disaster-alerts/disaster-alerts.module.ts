import { Module } from '@nestjs/common';
import { DisasterAlertsController } from './disaster-alerts.controller';
import { DisasterAlertsService } from './disaster-alerts.service';

@Module({
  controllers: [DisasterAlertsController],
  providers: [DisasterAlertsService],
  exports: [DisasterAlertsService],
})
export class DisasterAlertsModule {}
