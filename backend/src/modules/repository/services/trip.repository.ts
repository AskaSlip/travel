import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import { TripEntity } from '../../../database/entities/trip.entity';
import { ListTripsQueryDto } from '../../trips/models/dto/req/list-trips-query.dto';
import { UserID } from '../../../common/types/entity-ids.type';

@Injectable()
export class TripRepository  extends Repository<TripEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(TripEntity, dataSource.manager);
    }

    public async findAll(
      query: ListTripsQueryDto & {user_id: UserID}
    ): Promise<[TripEntity[], number]>{
        const qb = this.createQueryBuilder('trips');
        qb.where('trips.user_id = :userId', { userId: query.user_id });
        qb.take(query.limit);
        qb.skip(query.offset);

        return await qb.getManyAndCount();
    }

    public async findAllForAdmin(
      query: ListTripsQueryDto
    ): Promise<[TripEntity[], number]>{
        const qb = this.createQueryBuilder('trips');
        qb.take(query.limit);
        qb.skip(query.offset);

        return await qb.getManyAndCount();
    }

}