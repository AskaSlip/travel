import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString, IsUrl,
  Length,

} from 'class-validator';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';


export class TripReqDto {
  @ApiProperty({ example: 'My first trip' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(5, 100)
  trip_name: string;

  @ApiProperty({ example: 'some notes' })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @ApiProperty({ example: '2025-01-01', type: String })
  @IsDateString()
  date_of_trip?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  trip_picture?: string;
}
