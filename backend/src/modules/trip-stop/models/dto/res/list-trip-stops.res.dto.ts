import { TripStopResDto } from './trip-stop.res.dto';
import { ListTripStopsQueryDto } from '../req/list-trip-stops-query.dto';

export class ListTripStopsResDto extends ListTripStopsQueryDto{
  data: TripStopResDto[];
  total: number;
}