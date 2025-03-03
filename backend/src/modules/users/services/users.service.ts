import { Injectable } from '@nestjs/common';

import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { UserID } from '../../../common/types/entity-ids.type';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { UserEntity } from '../../../database/entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
  ) {
  }

  public async findMe(userData: IUserData) {
    return `${userData.userId}`;
  }

  public async updateMe(userData:IUserData, dto: UpdateUserReqDto) {
    return ` This action updates a user${userData.userId}`;
  }

  public async removeMe(id: UserID) {
    return `This action returns a #${id} user`;
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userId }) as UserEntity;
  }

}
