import { TripStopResDto } from '../models/dto/res/trip-stop.res.dto';
import { TripStopsEntity } from '../../../database/entities/trip-stop.entity';
import { ListTripStopsQueryDto } from '../models/dto/req/list-trip-stops-query.dto';
import { ListTripStopsResDto } from '../models/dto/res/list-trip-stops.res.dto';

export class TripStopMapper {
    public static toResDto(tripStop: Omit<TripStopsEntity, 'created' | 'updated'>): TripStopResDto {
        return {
            id: tripStop.id,
            key: tripStop.key,
            notes: tripStop.notes,
            lat: tripStop.lat,
            lng: tripStop.lng,
            trip_id: tripStop.trip_id,
            city: tripStop.city,
            country: tripStop.country,
            iso_code: tripStop.iso_code,
            image: tripStop.image,
        }
    }


    public static toResDtoList(
      data: TripStopsEntity[],
      total: number,
      query: ListTripStopsQueryDto,
    ): ListTripStopsResDto {
        return {
            data: data.map((trip) => this.toResDto(trip)),
            total,
            ...query
        };
    }

}