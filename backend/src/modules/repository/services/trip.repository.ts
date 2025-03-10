import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import { TripEntity } from '../../../database/entities/trip.entity';

@Injectable()
export class TripRepository  extends Repository<TripEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(TripEntity, dataSource.manager);
    }


}