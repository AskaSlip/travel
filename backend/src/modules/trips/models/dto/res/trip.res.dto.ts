import { ApiProperty } from '@nestjs/swagger';
import { TripID } from '../../../../../common/types/entity-ids.type';

export class TripResDto {
  @ApiProperty({ type: String })
  id: TripID;
  trip_name: string;
  description: string;
  date_of_trip: string;
  trip_picture: string;
}
