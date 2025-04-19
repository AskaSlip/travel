import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import { TripStopsEntity } from '../../../database/entities/trip-stop.entity';
import { ListTripStopsQueryDto } from '../../trip-stop/models/dto/req/list-trip-stops-query.dto';
import { TripID } from '../../../common/types/entity-ids.type';

@Injectable()
export class TripStopsRepository  extends Repository<TripStopsEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(TripStopsEntity, dataSource.manager);
    }

    public async findAll(
      query: ListTripStopsQueryDto & {trip_id: TripID}
    ): Promise<[TripStopsEntity[], number]>{
        const qb = this.createQueryBuilder('trip_stops');
        qb.where('trip_stops.trip_id = :tripId', { tripId: query.trip_id });
        qb.take(query.limit);
        qb.skip(query.offset);

        return await qb.getManyAndCount();
    }
}