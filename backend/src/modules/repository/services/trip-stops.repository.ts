import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import { TripStopsEntity } from '../../../database/entities/trip-stop.entity';

@Injectable()
export class TripStopsRepository  extends Repository<TripStopsEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(TripStopsEntity, dataSource.manager);
    }


}