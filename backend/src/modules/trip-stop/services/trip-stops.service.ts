import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TripStopResDto } from '../models/dto/res/trip-stop.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { TripID, TripStopID, UserID } from '../../../common/types/entity-ids.type';
import { TripStopReqDto } from '../models/dto/req/trip-stop.req';
import { TripStopsRepository } from '../../repository/services/trip-stops.repository';
import { TripStopUpdateReqDto } from '../models/dto/req/trip-stop.update.req.dto';
import { AwsConfig, Config } from '../../../configs/config-type';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { keyFromUrl } from '../../../common/helpers/upload-file.helper';


@Injectable()
export class TripStopsService {
  constructor(
    private readonly tripStopsRepository: TripStopsRepository,
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async createStop(userData: IUserData, dto: TripStopReqDto, tripId: TripID): Promise<TripStopResDto> {
    await this.isUserExist(userData.userId)

    const trip = await this.tripRepository.findOneBy({id: tripId});
    if(!trip){
      throw new BadRequestException('Trip not found')
    }

    return await this.tripStopsRepository.save(
      this.tripStopsRepository.create({
        ...dto,
        trip_id: tripId,
      })
    )
  }

  public async updateStop(userData: IUserData, dto: TripStopUpdateReqDto, tripStopId: TripStopID): Promise<TripStopResDto> {
    await this.isUserExist(userData.userId)

    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }

    await this.tripStopsRepository.update({id: tripStopId}, {key: dto.key, notes: dto.notes, image: dto.image});
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

  public async getTripStopById(userData: IUserData, tripStopId: TripStopID): Promise<TripStopResDto> {
    await this.isUserExist(userData.userId)

    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }
    return tripStop;
  }

  public async uploadImage(userData: IUserData, file: Express.Multer.File, tripStopId: TripStopID): Promise<TripStopResDto> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId)

    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }

    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.IMAGE,
      tripStopId,
    )

    if(tripStop.image){
      const key = keyFromUrl(tripStop.image, awsConfig)
      await this.fileStorageService.deleteFile(key);
    }

    const imageUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/${pathToFile}`;
    return await this.tripStopsRepository.save({
      ...tripStop,
      image: imageUrl,
    })
  }

  public async deleteImage(userData: IUserData, tripStopId: TripStopID): Promise<void> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId)

    const tripStop = await this.tripStopsRepository.findOneBy({id: tripStopId});
    if(!tripStop){
      throw new BadRequestException('Trip stop not found')
    }

    if(tripStop.image){
    const key = keyFromUrl(tripStop.image, awsConfig)
      await this.fileStorageService.deleteFile(key);
      await this.tripStopsRepository.save({
        ...tripStop,
        image: '',
      })
    }
  }





  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({id: userId})
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    return user;
  }
}
