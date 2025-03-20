import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TripStopResDto } from '../models/dto/res/trip-stop.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { TripID, TripStopID, UserID } from '../../../common/types/entity-ids.type';
import { TripStopReqDto } from '../models/dto/req/trip-stop.req';
import { TripStopsRepository } from '../../repository/services/trip-stops.repository';
import { TripStopUpdateReqDto } from '../models/dto/req/trip-stop.update.req.dto';


@Injectable()
export class TripStopsService {
  constructor(
    private readonly tripStopsRepository: TripStopsRepository,
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async createStop(userData: IUserData, dto: TripStopReqDto, tripId: TripID): Promise<TripStopResDto> {
    await this.isUserExist(userData.userId)

    const trip = await this.tripRepository.findOneBy({id: tripId});
    if(!trip){
      throw new BadRequestException('Trip not found')
    }

    const tripStop = await this.tripStopsRepository.save(
      this.tripStopsRepository.create({
        ...dto,
        trip_id: tripId,
      })
    )
    return tripStop;
  }

  public async updateStop(userData: IUserData, dto: TripStopUpdateReqDto, tripStopId: TripStopID): Promise<TripStopResDto> {
    await this.isUserExist(userData.userId)

    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }

    await this.tripStopsRepository.update({id: tripStopId}, {location: dto.location, notes: dto.notes});
    const updatedStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if (!updatedStop) {
      throw new InternalServerErrorException('Failed to retrieve updated trip stop');
    }
    return updatedStop;
  }

  public async deleteStop(userData: IUserData, tripStopId: TripStopID): Promise<void> {
    await this.isUserExist(userData.userId)
    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }
    await this.tripStopsRepository.delete({id: tripStopId});
  }






  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({id: userId})
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    return user;
  }
}
