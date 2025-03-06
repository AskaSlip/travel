import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum, IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {TransformHelper} from "../../../../../common/helpers/transform.helper";
import {RoleEnum} from "../../../../../common/enums/role.enum";


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

  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.cleanSpaces)
  @IsString()
  @Length(10, 100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @IsEnum(RoleEnum)
  @ApiProperty({ default: RoleEnum.GUEST })
  role: string;

  @IsOptional()
  @ApiProperty({ example: '2001-01-01', type: String })
  @IsDateString()
  birthdate?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isActive: boolean;


  @IsOptional()
  @IsString()
  @Length(0,2000)
  avatar?: string;
}
