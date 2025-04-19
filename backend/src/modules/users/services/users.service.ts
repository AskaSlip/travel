import { Injectable } from '@nestjs/common';

import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { UserID } from '../../../common/types/entity-ids.type';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { UserEntity } from '../../../database/entities/user.entity';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { ConfigService } from '@nestjs/config';
import { AwsConfig, Config } from '../../../configs/config-type';
import { keyFromUrl } from '../../../common/helpers/upload-file.helper';


@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService<Config>,
  ) {
  }

  public async findMe(userData: IUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async updateMe(userData:IUserData, dto: UpdateUserReqDto) {
    return ` This action updates a user${userData.userId}`;
  }

  public async removeMe(id: UserID) {
    return `This action returns a #${id} user`;
  }

  public async uploadAvatar(userData: IUserData, file: Express.Multer.File): Promise<UserEntity> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new Error('User not found');
    }
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.IMAGE,
      userData.userId,
      )
    if(user.avatar){
      const key = keyFromUrl(user.avatar, awsConfig)
      await this.fileStorageService.deleteFile(key);
    }
    const avatarUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/${pathToFile}`;
    return await this.userRepository.save({
      ...user,
      avatar: avatarUrl,
    })
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new Error('User not found');
    }

    const key = keyFromUrl(user.avatar, awsConfig)
    console.log(key);

    if (user.avatar) {
      await this.fileStorageService.deleteFile(key);
      await this.userRepository.save({
        ...user,
        avatar: '',
      });
    }


  }


  public async findOne(userId: UserID): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userId }) as UserEntity;
  }



}
