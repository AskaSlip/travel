import { ITripStop } from '@/models/ITripStop';

export interface ITrip {
  id?: string;
  trip_name: string;
  description?: string | null;
  date_of_trip?: string | null;
  trip_picture?: string | null ;
  tripStops?: ITripStop[];
  maxBudget?: string | null;
}

export type ITripUpdate = Omit<ITrip, 'id'| 'trip_picture' | 'tripStops'>;