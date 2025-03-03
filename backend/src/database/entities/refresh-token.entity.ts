import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {CreateUpdateModel} from "./models/create-update.model";
import {UserEntity} from "./user.entity";
import {RefreshTokenID, UserID} from "../../common/types/entity-ids.type";

@Entity('refresh-tokens')

export class RefreshTokenEntity extends CreateUpdateModel{
    @PrimaryGeneratedColumn('uuid')
    id: RefreshTokenID;

    @Column('text')
    refreshToken: string;

    @Column()
    user_id: UserID;
    @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user?: UserEntity;
}