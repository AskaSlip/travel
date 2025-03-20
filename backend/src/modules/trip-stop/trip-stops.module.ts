import { Module } from '@nestjs/common';
import { TripStopsController } from './trip-stops.controller';
import { TripStopsService } from './services/trip-stops.service';


@Module({
  imports: [],
  controllers: [TripStopsController],
  providers: [TripStopsService],
})
export class TripStopsModule {}
