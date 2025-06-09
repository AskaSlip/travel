import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListTripsQueryDto } from '../../trips/models/dto/req/list-trips-query.dto';
import { TripID } from '../../../common/types/entity-ids.type';
import { BudgetEntity } from '../../../database/entities/budget.entity';

@Injectable()
export class BudgetRepository extends Repository<BudgetEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BudgetEntity, dataSource.manager);
  }

  public async findAll(
    query: { trip_id: TripID },
  ): Promise<BudgetEntity[]> {
    const qb = this.createQueryBuilder('budget');
    qb.where('budget.trip_id = :trip_id', { trip_id: query.trip_id });

    return await qb.getMany();
  }


}