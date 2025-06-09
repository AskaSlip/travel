import { ApiProperty } from '@nestjs/swagger';
import { BudgetID, TripID } from '../../../../../common/types/entity-ids.type';

export class BudgetResDto {
  @ApiProperty({ type: String })
  id: BudgetID;
  category: string;
  value: number;

  @ApiProperty({ type: String })
  trip_id: TripID;
}
