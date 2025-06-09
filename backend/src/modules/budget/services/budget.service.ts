import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { BudgetReqDto } from '../models/dto/req/budget.req';
import { BudgetResDto } from '../models/dto/res/budget.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { BudgetID, TripID, UserID } from '../../../common/types/entity-ids.type';
import { BudgetRepository } from '../../repository/services/budget.repository';
import { BudgetUpdateReq } from '../models/dto/req/budget-update.req';


@Injectable()
export class BudgetService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly budgetRepository: BudgetRepository,
    private readonly tripRepository: TripRepository,
  ) {
  }


  public async addCategory(
    userData: IUserData,
    dto: BudgetReqDto,
    tripId: TripID,
  ): Promise<BudgetResDto> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const category = await this.budgetRepository.save(
      this.budgetRepository.create({
        ...dto,
        trip_id: trip.id,
      }),
    );
    return category;
  }

  public async changeValue(
    userData: IUserData,
    dto: BudgetUpdateReq,
    budgetId: BudgetID,
  ): Promise<BudgetResDto> {
    await this.isUserExist(userData.userId);
    const category = await this.budgetRepository.findOneBy({ id: budgetId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const updatedCategory = await this.budgetRepository.save({
      ...category,
      ...dto,
    });
    return updatedCategory;
  }

  public async deleteCategory(
    userData: IUserData,
    budgetId: BudgetID,
  ): Promise<void> {
    await this.isUserExist(userData.userId);
    const category = await this.budgetRepository.findOneBy({ id: budgetId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.budgetRepository.delete({ id: budgetId });
  }


  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
