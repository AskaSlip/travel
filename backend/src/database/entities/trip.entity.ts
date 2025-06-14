import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {CreateUpdateModel} from "./models/create-update.model";
import { TripID, UserID } from '../../common/types/entity-ids.type';
import { UserEntity } from './user.entity';
import { TripStopsEntity } from './trip-stop.entity';
import { TicketEntity } from './ticket.entity';
import { BudgetEntity } from './budget.entity';

@Entity('trips')

export class TripEntity extends CreateUpdateModel {
    @PrimaryGeneratedColumn('uuid')
    id: TripID;

    @Column('text')
    trip_name: string;

    @Column('text', {nullable: true})
    description: string;

    @Column('date', {nullable: true})
    date_of_trip: string;

    @Column('text', {nullable: true})
    trip_picture: string;

    @Column({type: 'uuid', nullable: true})
    editor_id?: UserID;

    @Column({ type: 'text', nullable: true })
    inviteToken?: string;

    @Column({ type: 'text', nullable: true })
    maxBudget?: string;

    @Column()
    user_id: UserID;
    @ManyToOne(() => UserEntity, (entity) => entity.trips, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user?: UserEntity;


    @OneToMany(() => TripStopsEntity, (entity) => entity.trip)
    tripStops: TripStopsEntity[];

    @OneToMany(() => TicketEntity, (entity) => entity.trip)
    tickets: TicketEntity[];

    @OneToMany(() => BudgetEntity, (entity) => entity.trip)
    budgets: BudgetEntity[];
}