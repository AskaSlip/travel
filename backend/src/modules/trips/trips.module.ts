import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './services/trips.service';
import { FileStorageModule } from '../file-storage/file-storage.module';


@Module({
  imports: [FileStorageModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
