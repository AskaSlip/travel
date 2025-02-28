import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RoleEnum} from "../../common/enums/role.enum";

@Entity('users')

export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    username: string;

    @Column('text', {unique: true})
    email: string;

    @Column('enum', {enum: RoleEnum, default: RoleEnum.GUEST})
    role: RoleEnum;

    @Column('date')
    birthdate: Date;

    @Column('boolean', {default: false})
    isActive: boolean;
}