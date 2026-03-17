import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { IngestionProcessor } from './ingestion.processor';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'ingestion' }),
    SearchModule,
  ],
  providers: [IngestionService, IngestionProcessor],
  controllers: [IngestionController],
  exports: [IngestionService],
})
export class IngestionModule {}
