import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './services/tickets.service';
import { FileStorageModule } from '../file-storage/file-storage.module';


@Module({
  imports: [FileStorageModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
