import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import { TicketEntity } from '../../../database/entities/ticket.entity';
import { ListTripsQueryDto } from '../../trips/models/dto/req/list-trips-query.dto';
import { TripID, UserID } from '../../../common/types/entity-ids.type';
import { TripEntity } from '../../../database/entities/trip.entity';

@Injectable()
export class TicketRepository  extends Repository<TicketEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(TicketEntity, dataSource.manager);
    }

    public async findAll(
      query: ListTripsQueryDto & {trip_id: TripID}
    ): Promise<[TicketEntity[], number]>{
        const qb = this.createQueryBuilder('tickets');
        qb.where('tickets.trip_id = :trip_id', { trip_id: query.trip_id });
        qb.take(query.limit);
        qb.skip(query.offset);

        return await qb.getManyAndCount();
    }


}