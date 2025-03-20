import { PickType } from '@nestjs/swagger';
import { TripStopReqDto } from './trip-stop.req';

export class TripStopUpdateReqDto extends PickType(TripStopReqDto, [
  'location',
  'notes'
]){}