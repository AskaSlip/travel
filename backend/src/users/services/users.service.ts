import { Injectable } from '@nestjs/common';

import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserBaseReqDto } from '../models/dto/req/user-base.req';

@Injectable()
export class UsersService {
  create(createUserDto: UserBaseReqDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserReqDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
