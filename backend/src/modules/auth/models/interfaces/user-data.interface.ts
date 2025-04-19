import { UserID } from '../../../../common/types/entity-ids.type';
import { RoleEnum } from '../../../../common/enums/role.enum';

export interface IUserData {
    userId: UserID;
    email: string;
    role: RoleEnum;
}