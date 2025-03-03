import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {UserEntity} from "../../../database/entities/user.entity";
import { ListUserQueryDto } from '../../users/models/dto/req/list-user-query.dto';

@Injectable()
export class UserRepository  extends Repository<UserEntity>{
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.manager);
    }


    public async findAll(
      query: ListUserQueryDto,
    ): Promise<[UserEntity[], number]> {
        const qb = this.createQueryBuilder('users');

        qb.take(query.limit);
        qb.skip(query.offset);

        return await qb.getManyAndCount();
    }


}