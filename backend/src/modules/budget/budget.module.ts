import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './services/budget.service';


@Module({
  imports: [],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {
}
