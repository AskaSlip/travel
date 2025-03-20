import { ListTripsQueryDto } from '../req/list-trips-query.dto';
import { TripResDto } from './trip.res.dto';

export class ListTripsResDto extends ListTripsQueryDto{
    data: TripResDto[];
    total: number;
}