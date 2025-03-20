import { ApiProperty } from '@nestjs/swagger';
import { TripID, UserID } from '../../../../../common/types/entity-ids.type';
import { TripStopResDto } from '../../../../trip-stop/models/dto/res/trip-stop.res.dto';

export class TripResDto {
  @ApiProperty({ type: String })
  id: TripID;
  trip_name: string;
  description: string;
  date_of_trip: string;
  trip_picture: string;
  tripStops?: TripStopResDto[]

  @ApiProperty({ type: String })
  user_id: UserID;
}
