import { Injectable, UnauthorizedException } from '@nestjs/common';

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
import { AuthService } from '../../auth/services/auth.service';
import { MailService } from '../../mail/services/mail.service';


@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService<Config>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {
  }

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return this.isUserExist(userData.userId);
  }

  public async updateMe(userData: IUserData, dto: UpdateUserReqDto): Promise<UserEntity> {
    const user = await this.isUserExist(userData.userId);
    const updatedUser = {
      ...user,
      ...dto,
    };
    return await this.userRepository.save(updatedUser);

  }

  public async removeMe(userData: IUserData): Promise<void> {
    const user = await this.isUserExist(userData.userId);
    await this.mailService.sendEmailAboutDeletedAccount(userData.email, user.username);
    await this.authService.signOut(userData);
    await this.userRepository.delete({ id: userData.userId });

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
    );
    if (user.avatar) {
      const key = keyFromUrl(user.avatar, awsConfig);
      await this.fileStorageService.deleteFile(key);
    }
    const avatarUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/${pathToFile}`;
    return await this.userRepository.save({
      ...user,
      avatar: avatarUrl,
    });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new Error('User not found');
    }

    const key = keyFromUrl(user.avatar, awsConfig);
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


  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

}
