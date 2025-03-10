import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserBaseReqDto } from '../../../../users/models/dto/req/user-base.req';
import { IsString } from 'class-validator';

export class ResetPasswordReqDto extends PickType(UserBaseReqDto, [
  'password'
]){
  @ApiProperty()
  @IsString()
  resetToken: string;
}