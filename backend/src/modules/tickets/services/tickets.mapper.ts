
import { TicketEntity } from '../../../database/entities/ticket.entity';
import { TicketResDto } from '../models/dto/res/ticket.res.dto';
import { ListTicketsQueryDto } from '../models/dto/req/list-tickets-query.dto';
import { ListTicketsResDto } from '../models/dto/res/list-tickets.res.dto';

export class TicketsMapper {
    public static toResDto(ticket: Omit<TicketEntity, 'created' | 'updated'>): TicketResDto {
        return {
            id: ticket.id,
            trip_id: ticket.trip_id,
            name: ticket.name,
            file_url: ticket.file_url,
        }
    }

    public static toResDtoList(
      data: TicketEntity[],
      total: number,
      query: ListTicketsQueryDto,
    ): ListTicketsResDto {
        return {
            data: data.map((ticket) => this.toResDto(ticket)),
            total,
            ...query
        };
    }


}