import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {CreateUpdateModel} from "./models/create-update.model";
import { TicketID, TripID, TripStopID } from '../../common/types/entity-ids.type';
import { TripEntity } from './trip.entity';

@Entity('tickets')

export class TicketEntity extends CreateUpdateModel {
    @PrimaryGeneratedColumn('uuid')
    id: TicketID;

    @Column('text')
    name: string;

    @Column('text', {nullable: true})
    file_url?: string;

    @Column()
    trip_id: TripID;
    @ManyToOne(() => TripEntity, (entity) => entity.tickets, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'trip_id'})
    trip?: TripEntity;


}