import { PartialType, PickType } from '@nestjs/swagger';
import { TicketReqDto } from './ticket.req';

export class TicketUpdateReq extends PartialType(
  PickType(TicketReqDto, ['name', 'file_url']),
) {
}
