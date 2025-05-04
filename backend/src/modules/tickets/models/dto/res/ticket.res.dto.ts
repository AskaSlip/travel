import { ApiProperty } from '@nestjs/swagger';
import { TicketID, TripID } from '../../../../../common/types/entity-ids.type';

export class TicketResDto {
  @ApiProperty({ type: String })
  id: TicketID;
  name: string;
  file_url?: string;

  @ApiProperty({ type: String })
  trip_id: TripID;
}
