import { PickType } from '@nestjs/swagger';
import { UserBaseReqDto } from '../../../../users/models/dto/req/user-base.req';

export class EmailReqDto extends PickType(UserBaseReqDto, [
  'email'
]){}