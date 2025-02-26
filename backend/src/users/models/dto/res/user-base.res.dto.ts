import { ApiProperty } from '@nestjs/swagger';

import { RoleEnum } from '../../../../common/enums/role.enum';
import { UserID } from '../../../../common/types/entity-ids.type';

export class UserBaseResDto {
  @ApiProperty({ type: String })
  id: UserID;

  email: string;
  username: string;
  role: RoleEnum;
  birthdate: Date;
  isActive: boolean;
}
