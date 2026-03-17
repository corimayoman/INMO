import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Processor('ingestion')
export class IngestionProcessor {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(private ingestionService: IngestionService) {}

  @Process('run-connector')
  async handleRunConnector(job: Job<{ connectorId: string }>) {
    this.logger.log(`Processing connector job: ${job.data.connectorId}`);
    await this.ingestionService.runConnector(job.data.connectorId);
  }

  @Process('detect-stale')
  async handleDetectStale() {
    await this.ingestionService.detectStaleListings();
  }
}
