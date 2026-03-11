import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BadgesService } from './badges.service';

@Processor('badge-check')
export class BadgesProcessor {
  private readonly logger = new Logger(BadgesProcessor.name);

  constructor(private readonly badgesService: BadgesService) {}

  @Process()
  async handleBadgeCheck(job: Job<{ userId: string }>) {
    this.logger.log(`Processing badge check for user ${job.data.userId}`);

    try {
      const awarded = await this.badgesService.checkAndAwardBadges(job.data.userId);

      if (awarded.length > 0) {
        this.logger.log(
          `Awarded ${awarded.length} badges to user ${job.data.userId}: ${awarded.join(', ')}`,
        );
      }

      return { awarded };
    } catch (error) {
      this.logger.error(
        `Failed to process badge check for user ${job.data.userId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
