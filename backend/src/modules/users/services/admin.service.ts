import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { AdminBaseReqDto } from '../models/dto/req/admin-base.req.dto';
import { AdminBaseResDto } from '../models/dto/res/admin-base.res.dto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../../../common/enums/role.enum';
import { UserMapper } from './user.mapper';
import { ListUserQueryDto } from '../models/dto/req/list-user-query.dto';
import { UserEntity } from '../../../database/entities/user.entity';


@Injectable()
export class AdminService {
  constructor(
    private userRepository: UserRepository,
  ) {
  }

  public async createAdmin(dto: AdminBaseReqDto): Promise<AdminBaseResDto> {
    await this.isEmailExist(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({
          ...dto,
          password,
          role: RoleEnum.ADMIN,
          isActive: true,
        },
      ),
    );
    return UserMapper.toAdminResDto(user);
  }

  public async getAllUsers(
    query: ListUserQueryDto
  ): Promise<[UserEntity[], number]> {
    return await this.userRepository.findAll(query);

  }


  private async isEmailExist(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
