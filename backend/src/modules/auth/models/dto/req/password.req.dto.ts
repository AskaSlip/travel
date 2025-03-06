import { PickType } from '@nestjs/swagger';
import { UserBaseReqDto } from '../../../../users/models/dto/req/user-base.req';

export class PasswordReqDto extends PickType(UserBaseReqDto, [
  'password'
]){}