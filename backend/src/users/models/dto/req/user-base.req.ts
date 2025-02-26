import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { RoleEnum } from '../../../../common/enums/role.enum';
import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class UserBaseReqDto {
  @ApiProperty({ example: 'Anna Black' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(5, 70)
  username: string;

  @ApiProperty({ example: 'email@test.com' })
  @Transform(TransformHelper.cleanSpaces)
  @IsString()
  @IsEmail()
  @Length(10, 150)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  //todo check with OAuth if password is optional
  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.cleanSpaces)
  @IsString()
  @Length(10, 100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @IsEnum(RoleEnum)
  @ApiProperty({ default: RoleEnum.GUEST })
  role: string;

  @ApiProperty({ example: '2001-01-01', type: String })
  @Transform(TransformHelper.trim)
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  isActive: boolean;
}
