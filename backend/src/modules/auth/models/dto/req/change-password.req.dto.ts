import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordReqDto {
  @ApiProperty()
  @Transform(TransformHelper.cleanSpaces)
  @IsString()
  @Length(10, 100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  currentPassword: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.cleanSpaces)
  @IsString()
  @Length(10, 100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  newPassword: string;
}

