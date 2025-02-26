import { PickType } from '@nestjs/swagger';

import { UserBaseReqDto } from './user-base.req';

export class UpdateUserReqDto extends PickType(UserBaseReqDto, [
  'username',
  'email',
  'birthdate',
]) {}
