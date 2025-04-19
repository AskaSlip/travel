import { ITripStop } from '@/models/ITripStop';

export interface ITrip {
  id?: string;
  trip_name: string;
  description?: string | null;
  date_of_trip?: Date | null;
  trip_picture?: string | null;
  tripStops?: ITripStop[];
}