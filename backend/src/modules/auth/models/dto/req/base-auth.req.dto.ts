import { PickType } from '@nestjs/swagger';
import {UserBaseReqDto} from "../../../../users/models/dto/req/user-base.req";



export class BaseAuthReqDto extends PickType(UserBaseReqDto, [
  'email',
  'password',
  'username',
  'avatar',


]) {}
