import { Module } from '@nestjs/common';
import { TripStopsController } from './trip-stops.controller';
import { TripStopsService } from './services/trip-stops.service';
import { FileStorageModule } from '../file-storage/file-storage.module';


@Module({
  imports: [FileStorageModule],
  controllers: [TripStopsController],
  providers: [TripStopsService],
})
export class TripStopsModule {}
