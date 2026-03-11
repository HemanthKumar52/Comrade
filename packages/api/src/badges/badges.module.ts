import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { BadgesProcessor } from './badges.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'badge-check' }),
  ],
  controllers: [BadgesController],
  providers: [BadgesService, BadgesProcessor],
  exports: [BadgesService],
})
export class BadgesModule {}
