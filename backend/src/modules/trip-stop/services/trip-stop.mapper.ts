import { TripStopResDto } from '../models/dto/res/trip-stop.res.dto';
import { TripStopsEntity } from '../../../database/entities/trip-stop.entity';

export class TripStopMapper {
    public static toResDto(tripStop: Omit<TripStopsEntity, 'created' | 'updated'>): TripStopResDto {
        return {
            id: tripStop.id,
            location: tripStop.location,
            notes: tripStop.notes,
            lat: tripStop.lat,
            lng: tripStop.lng,
            trip_id: tripStop.trip_id,
        }
    }

}