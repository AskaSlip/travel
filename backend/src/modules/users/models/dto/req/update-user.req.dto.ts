import { PartialType, PickType } from '@nestjs/swagger';

import { UserBaseReqDto } from './user-base.req';


export class UpdateUserReqDto extends PartialType(
  PickType(UserBaseReqDto, ['username', 'email', 'birthdate']),
) {}
