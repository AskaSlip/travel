import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TripReqDto } from '../models/dto/req/trip.req';
import { TripResDto } from '../models/dto/res/trip.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { TripID, UserID } from '../../../common/types/entity-ids.type';
import { ListTripsQueryDto } from '../models/dto/req/list-trips-query.dto';
import { ListTripsResDto } from '../models/dto/res/list-trips.res.dto';
import { TripEntity } from '../../../database/entities/trip.entity';


@Injectable()
export class TripsService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async createTrip(userData: IUserData, dto: TripReqDto): Promise<TripResDto> {
    await this.isUserExist(userData.userId);

    const trip = await this.tripRepository.save(
      this.tripRepository.create({
        ...dto,
        user_id: userData.userId,
      })
    )
    return trip;
  }


  public async getMyTrips(userData: IUserData, query: ListTripsQueryDto): Promise<[TripEntity[], number]> {
    await this.isUserExist(userData.userId);
    return await this.tripRepository.findAll({ ...query, user_id: userData.userId });
  }

  public async getAllTrips(userData: IUserData, query: ListTripsQueryDto): Promise<[TripEntity[], number]> {
    await this.isUserExist(userData.userId);
    return await this.tripRepository.findAllForAdmin(query);
  }

  public async getTripById(userData: IUserData, tripId: TripID): Promise<TripEntity> {
    await this.isUserExist(userData.userId);

    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['tripStops'],
    });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }

    const tripWithStops = {
      ...trip,
      tripStops: trip.tripStops || [],
    }

    return tripWithStops;
  }

  public async deleteTripById(userData: IUserData, tripId: TripID): Promise<void> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    await this.tripRepository.delete({ id: tripId });
  }

  public async updateTripById(userData: IUserData, tripId: TripID, dto: TripReqDto): Promise<TripEntity & { user_id: UserID }> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    await this.tripRepository.update({ id: tripId }, dto);
    const updatedTrip = await this.tripRepository.findOneBy({ id: tripId });
    if (!updatedTrip) {
      throw new BadRequestException('Trip not found after update');
    }

    return {
      ...updatedTrip,
      user_id: userData.userId,
    };
  }







  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({id: userId})
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    return user;
  }
}
