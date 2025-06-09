import { PartialType, PickType } from '@nestjs/swagger';
import { BudgetReqDto } from './budget.req';

export class BudgetUpdateReq extends PartialType(
  PickType(BudgetReqDto, ['value']),
) {
}
