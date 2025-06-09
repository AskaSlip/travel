import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude, IsLongitude,
  IsOptional,
  IsString,
  Length,

} from 'class-validator';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { Transform } from 'class-transformer';


export class TripStopReqDto {
  @ApiProperty({ example: 'Nice coffee shop' })
  @IsString()
  @Length(5, 100)
  key: string;

  @ApiProperty({ example: 'some notes' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  notes?: string;

  @ApiProperty({ example: '-33.85673152928874' })
  @IsLatitude()
  @Transform(TransformHelper.cleanSpaces)
  lat: number;

  @ApiProperty({ example: '151.2151336669922' })
  @IsLongitude()
  @Transform(TransformHelper.cleanSpaces)
  lng: number;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  iso_code: string;

  @ApiProperty({ example: 'some image url' })
  @IsString()
  @IsOptional()
  image?: string;
}
