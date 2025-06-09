import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { BudgetService } from './services/budget.service';
import { BudgetResDto } from './models/dto/res/budget.res.dto';
import { BudgetID, TripID } from '../../common/types/entity-ids.type';
import { BudgetMapper } from './services/budget.mapper';
import { BudgetReqDto } from './models/dto/req/budget.req';
import { BudgetUpdateReq } from './models/dto/req/budget-update.req';


@ApiTags('budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {
  }

  @ApiBearerAuth()
  @Post('budget/:tripId')
  public async addCategory(
    @CurrentUser() userData: IUserData,
    @Body() dto: BudgetReqDto,
    @Param('tripId') tripId: TripID,
  ): Promise<BudgetResDto> {
    const result = await this.budgetService.addCategory(userData, dto, tripId);
    return BudgetMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Patch('budget/:budgetId')
  public async changeValue(
    @CurrentUser() userData: IUserData,
    @Body() dto: BudgetUpdateReq,
    @Param('budgetId') budgetId: BudgetID,
  ): Promise<BudgetResDto> {
    const result = await this.budgetService.changeValue(userData, dto, budgetId);
    return BudgetMapper.toResDto(result);
  }


  @ApiBearerAuth()
  @Delete('budget/:budgetId')
  public async deleteCategory(
    @CurrentUser() userData: IUserData,
    @Param('budgetId') budgetId: BudgetID,
  ): Promise<void> {
    await this.budgetService.deleteCategory(userData, budgetId);
  }


}
