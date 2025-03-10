import { TripEntity } from '../../../database/entities/trip.entity';
import { TripResDto } from '../models/dto/res/trip.res.dto';

export class TripMapper {
    public static toResDto(trip: TripEntity): TripResDto {
        return {
            id: trip.id,
            trip_name: trip.trip_name,
            description: trip.description,
            date_of_trip: trip.date_of_trip,
            trip_picture: trip.trip_picture,
        }
    }

}