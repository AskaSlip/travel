import { ApiProperty } from '@nestjs/swagger';
import { TripID, TripStopID } from '../../../../../common/types/entity-ids.type';
import { TripResDto } from '../../../../trips/models/dto/res/trip.res.dto';

export class TripStopResDto {
  @ApiProperty({ type: String })
  id: TripStopID
  location: string;
  notes: string;
  lat: number;
  lng: number;
  trip_id: TripID;
}
