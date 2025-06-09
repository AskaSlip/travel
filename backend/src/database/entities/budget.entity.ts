import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUpdateModel } from './models/create-update.model';
import { BudgetID, TripID } from '../../common/types/entity-ids.type';
import { TripEntity } from './trip.entity';

@Entity('budget')

export class BudgetEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: BudgetID;

  @Column('text')
  category: string;

  @Column('text')
  value: number;

  @Column()
  trip_id: TripID;
  @ManyToOne(() => TripEntity, (entity) => entity.budgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trip_id' })
  trip?: TripEntity;


}