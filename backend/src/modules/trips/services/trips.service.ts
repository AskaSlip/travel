import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TripReqDto } from '../models/dto/req/trip.req';
import { TripResDto } from '../models/dto/res/trip.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { TripID, UserID } from '../../../common/types/entity-ids.type';
import { ListTripsQueryDto } from '../models/dto/req/list-trips-query.dto';
import { TripEntity } from '../../../database/entities/trip.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AwsConfig, Config, JwtConfig } from '../../../configs/config-type';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { keyFromUrl } from '../../../common/helpers/upload-file.helper';
import { ListTripStopsQueryDto } from '../../trip-stop/models/dto/req/list-trip-stops-query.dto';
import { TripStopsEntity } from '../../../database/entities/trip-stop.entity';
import { TripStopsRepository } from '../../repository/services/trip-stops.repository';
import { TripBudget, TripUpdateReq } from '../models/dto/req/trip-update.req';
import { ListTicketsQueryDto } from '../../tickets/models/dto/req/list-tickets-query.dto';
import { TicketEntity } from '../../../database/entities/ticket.entity';
import { TicketRepository } from '../../repository/services/ticket.repository';
import { BudgetRepository } from '../../repository/services/budget.repository';
import { BudgetEntity } from '../../../database/entities/budget.entity';


@Injectable()
export class TripsService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
  private readonly tripStopsRepository: TripStopsRepository,
  private readonly ticketRepository: TicketRepository,
  private readonly budgetRepository: BudgetRepository,
  ) {}

  public async createTrip(userData: IUserData, dto: TripReqDto): Promise<TripResDto> {
    const user = await this.isUserExist(userData.userId);

    if(!user.isVerify){
      const tripsAmount = await this.tripRepository.count({ where: { user_id: userData.userId } });
      if (tripsAmount >= 1) {
        throw new ForbiddenException('You can create only one trip before email confirmation');
      }
    }

    return await this.tripRepository.save(
      this.tripRepository.create({
        ...dto,
        user_id: userData.userId,
      })
    )
  }


  public async getMyTrips(userData: IUserData, query: ListTripsQueryDto): Promise<[TripEntity[], number]> {
    await this.isUserExist(userData.userId);
    return await this.tripRepository.findAll({ ...query, user_id: userData.userId });
  }

  public async getAllTrips(userData: IUserData, query: ListTripsQueryDto): Promise<[TripEntity[], number]> {
    await this.isUserExist(userData.userId);
    return await this.tripRepository.findAllForAdmin(query);
  }

  public async getTripStops(userData: IUserData, tripId: TripID, query: ListTripStopsQueryDto): Promise<[TripStopsEntity[], number]> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    return await this.tripStopsRepository.findAll({ ...query, trip_id: tripId });
  }


  public async getTripTickets(userData: IUserData, tripId: TripID, query: ListTicketsQueryDto): Promise<[TicketEntity[], number]> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    return await this.ticketRepository.findAll({ ...query, trip_id: tripId });
  }

  public async getTripBudget(userData: IUserData, tripId: TripID): Promise<BudgetEntity[]> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    return await this.budgetRepository.findAll({trip_id: tripId });
  }

  public async assignMaxBudget(userData: IUserData, tripId: TripID, dto: TripBudget): Promise<TripBudget>{
    await this.isUserExist(userData.userId)
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    return await this.tripRepository.save({
      ...trip,
      maxBudget: dto.maxBudget,
    })
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

    return {
      ...trip,
      tripStops: trip.tripStops || [],
    }

  }

  public async deleteTripById(userData: IUserData, tripId: TripID): Promise<void> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found')
    }
    await this.tripRepository.delete({ id: tripId });
  }

  public async updateTripById(userData: IUserData, tripId: TripID, dto: TripUpdateReq): Promise<TripEntity & { user_id: UserID }> {
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

  public async uploadImage(userData: IUserData, file: Express.Multer.File, tripId: TripID): Promise<TripEntity>{
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.IMAGE,
      tripId,
    )
    if (trip.trip_picture) {
      const key = keyFromUrl(trip.trip_picture, awsConfig)
      await this.fileStorageService.deleteFile(key);
    }
    const imageUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/${pathToFile}`;
    return await this.tripRepository.save({
      ...trip,
      trip_picture: imageUrl,
    })
  }

  public async deleteImage(userData: IUserData, tripId: TripID): Promise<void> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    if (trip.trip_picture) {
    const key = keyFromUrl(trip.trip_picture, awsConfig)
      await this.fileStorageService.deleteFile(key);
      await this.tripRepository.save({
        ...trip,
        trip_picture: '',
      });
    }
  }


// todo розібратись з інвайтами і організувати всю ту штуку з FireBase
//   public async generateInvite(tripId: TripID, userData: IUserData): Promise<string> {
//     await this.isUserExist(userData.userId);
//     const config = this.configService.get<JwtConfig>('jwt') as JwtConfig;
//
//     const trip = await this.tripRepository.findOneBy({ id: tripId });
//     if (!trip || trip.user_id !== userData.userId) {
//       throw new ForbiddenException('Only trip owner can generate invite link');
//     }
//     const inviteToken = jwt.sign({tripId}, config.accessSecret, {expiresIn: '24hr'})
//
//     await this.tripRepository.update(tripId, {inviteToken});
//     return `${process.env.FRONTEND_URL}/invite/${tripId}?token=${inviteToken}`;
//   }
//
//   public async joinTrip(token: string, userData: IUserData): Promise<void>{
//     const config = this.configService.get<JwtConfig>('jwt') as JwtConfig;
//
//     try {
//       const decoded: any = jwt.verify(token, config.accessSecret) as { tripId: TripID };
//       const trip = await this.tripRepository.findOneBy({ id: decoded.tripId });
//
//       if (!trip) {
//         throw new NotFoundException('Trip not found');
//       }
//
//       if(!trip.editor_id){
//         await this.tripRepository.update(decoded.tripId, { editor_id: userData.userId });
//       }
//     }catch(error){
//       throw new ForbiddenException("Invalid or expired invite link")
//     }
//   }




  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({id: userId})
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    return user;
  }
}
