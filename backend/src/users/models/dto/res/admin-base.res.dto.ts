import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from './user-base.res.dto';

export class AdminBaseResDto extends PickType(UserBaseResDto, [
  'id',
  'username',
  'role',
]) {}
