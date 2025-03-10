import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TripReqDto } from '../models/dto/req/trip.req';
import { TripResDto } from '../models/dto/res/trip.res.dto';
import { UserRepository } from '../../repository/services/user.repository';


@Injectable()
export class TripsService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async createTrip(userData: IUserData, dto: TripReqDto): Promise<TripResDto> {
    const user = await this.userRepository.findOneBy({id: userData.userId})
    if(!user){
      throw new UnauthorizedException('User not found')
    }

    const trip = await this.tripRepository.save(
      this.tripRepository.create({
        ...dto,
        user_id: userData.userId,
      })
    )
    return trip;

  }


}
