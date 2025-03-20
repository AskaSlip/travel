import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt, IsLatitude, IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Length,

} from 'class-validator';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { Transform } from 'class-transformer';


export class TripStopReqDto {
  @ApiProperty({ example: 'Nice coffee shop' })
  @IsString()
  @Length(5, 200)
  location: string;

  @ApiProperty({ example: 'some notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '-33.85673152928874' })
  @IsLatitude()
  @Transform(TransformHelper.cleanSpaces)
  lat: number;

  @ApiProperty({ example: '151.2151336669922' })
  @IsLongitude()
  @Transform(TransformHelper.cleanSpaces)
  lng: number;
}
