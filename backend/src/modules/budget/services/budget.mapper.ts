import { BudgetResDto } from '../models/dto/res/budget.res.dto';
import { BudgetEntity } from '../../../database/entities/budget.entity';

export class BudgetMapper {
  public static toResDto(budget: Omit<BudgetEntity, 'created' | 'updated'>): BudgetResDto {
    return {
      id: budget.id,
      trip_id: budget.trip_id,
      category: budget.category,
      value: budget.value,
    };
  }

  public static toResDtoList(
    data: BudgetEntity[]
  ): { data: BudgetResDto[] } {
    return {
      data: data.map((budget) => this.toResDto(budget)),
    };
  }


}