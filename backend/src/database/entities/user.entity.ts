import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoleEnum} from "../../common/enums/role.enum";
import {CreateUpdateModel} from "./models/create-update.model";
import {RefreshTokenEntity} from "./refresh-token.entity";
import {UserID} from "../../common/types/entity-ids.type";
import { TripEntity } from './trip.entity';

@Entity('users')

export class UserEntity extends CreateUpdateModel {
    @PrimaryGeneratedColumn('uuid')
    id: UserID;

    @Column('text')
    username: string;

    @Column('text', {unique: true})
    email: string;

    @Column('text')
    password: string;

    @Column('enum', {enum: RoleEnum, default: RoleEnum.GUEST})
    role: RoleEnum;

    @Column('date', {nullable: true})
    birthdate: string;

    @Column('boolean', {default: false})
    isVerify: boolean;

    @Column('text', {nullable: true})
    avatar: string;

    @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
    refreshTokens: RefreshTokenEntity[];

    @OneToMany(() => TripEntity, (entity) => entity.user)
    trips: TripEntity[];
}