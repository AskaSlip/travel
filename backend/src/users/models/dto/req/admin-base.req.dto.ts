import { PickType } from '@nestjs/swagger';

import { UserBaseReqDto } from './user-base.req';

export class AdminBaseReqDto extends PickType(UserBaseReqDto, [
  'email',
  'password',
  'username',
]) {}
