import { ListTicketsQueryDto } from '../req/list-tickets-query.dto';
import { TicketResDto } from './ticket.res.dto';
import { TicketReqDto } from '../req/ticket.req';

export class ListTicketsResDto extends ListTicketsQueryDto{
    data: TicketResDto[];
    total: number;
}