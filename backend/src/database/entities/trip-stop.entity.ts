import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {CreateUpdateModel} from "./models/create-update.model";
import { TripID, TripStopID } from '../../common/types/entity-ids.type';
import { TripEntity } from './trip.entity';

@Entity('trip-stops')

export class TripStopsEntity extends CreateUpdateModel {
    @PrimaryGeneratedColumn('uuid')
    id: TripStopID;

    @Column('text')
    location: string;

    @Column('text', {nullable: true})
    notes: string;

    @Column('text')
    lat: number;

    @Column('text')
    lng: number


    @Column()
    trip_id: TripID;
    @ManyToOne(() => TripEntity, (entity) => entity.tripStops, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'trip_id'})
    trip?: TripEntity;


}