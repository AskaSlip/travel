import { ApiProperty } from '@nestjs/swagger';
import {UserID} from "../../../../../common/types/entity-ids.type";
import {RoleEnum} from "../../../../../common/enums/role.enum";


export class UserBaseResDto {
  @ApiProperty({ type: String })
  id: UserID;
  email: string;
  username: string;
  role: RoleEnum;
  birthdate?: string;
  isVerify: boolean;
  avatar?: string;
}
