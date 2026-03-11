import { Module } from '@nestjs/common';
import { PassportStampsController } from './passport-stamps.controller';
import { PassportStampsService } from './passport-stamps.service';

@Module({
  controllers: [PassportStampsController],
  providers: [PassportStampsService],
  exports: [PassportStampsService],
})
export class PassportStampsModule {}
