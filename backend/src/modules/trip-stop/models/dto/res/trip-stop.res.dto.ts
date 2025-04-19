import { ApiProperty } from '@nestjs/swagger';
import { TripID, TripStopID } from '../../../../../common/types/entity-ids.type';

export class TripStopResDto {
  @ApiProperty({ type: String })
  id: TripStopID
  key: string;
  notes: string;
  lat: number;
  lng: number;
  locality: string;
  image?: string;
  trip_id: TripID;
}
