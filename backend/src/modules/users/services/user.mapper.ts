import {UserEntity} from "../../../database/entities/user.entity";
import {UserBaseResDto} from "../models/dto/res/user-base.res.dto";
import {IJwtPayload} from "../../auth/models/interfaces/jwt-payload.interface";
import { AdminBaseResDto } from '../models/dto/res/admin-base.res.dto';
import { ListUserQueryDto } from '../models/dto/req/list-user-query.dto';
import { ListUserResDto } from '../models/dto/res/list-user.res.dto';

export class UserMapper {
    public static toResDto(user: UserEntity): UserBaseResDto {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            birthdate: user.birthdate,
            isActive: user.isActive,
            avatar: user.avatar,
        }
    }

    public static toAdminResDto(user: UserEntity): AdminBaseResDto {
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        }
    }

    public static toIUserData(user: UserEntity, jwtPayload: IJwtPayload): any {
        return {
            userId: user.id,
            email: user.email,
        }
    }

    public static toResDtoList(
      data: UserEntity[],
      total: number,
      query: ListUserQueryDto,
    ): ListUserResDto {
        return {
            data: data.map((user) => this.toResDto(user)),
            total,
            limit: query.limit,
            offset: query.offset,
        };
    }
}