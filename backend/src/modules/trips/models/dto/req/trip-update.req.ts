import { PartialType, PickType } from '@nestjs/swagger';
import { TripReqDto } from './trip.req';

export class TripUpdateReq extends PartialType(
  PickType(TripReqDto, ['date_of_trip', 'trip_picture', 'trip_name', 'description']),
) {}
