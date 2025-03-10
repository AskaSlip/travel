import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './services/trips.service';


@Module({
  imports: [],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
