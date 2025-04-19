import {
  Body,
  Controller, Delete, Get, Param, Patch,
  Post, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { TripStopsService } from './services/trip-stops.service';
import { TripStopResDto } from './models/dto/res/trip-stop.res.dto';
import { TripStopReqDto } from './models/dto/req/trip-stop.req';
import { TripID, TripStopID } from '../../common/types/entity-ids.type';
import { TripStopMapper } from './services/trip-stop.mapper';
import { TripStopUpdateReqDto } from './models/dto/req/trip-stop.update.req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../common/decorators/api-file.decorator';

@ApiTags('trip-stop')
@Controller('trip-stop')
export class TripStopsController {
  constructor(private readonly tripStopsService: TripStopsService) {
  }


  @ApiBearerAuth()
  @Post('create-stop/:tripId')
  public async createStop(
    @CurrentUser() userData: IUserData,
    @Body() dto: TripStopReqDto,
    @Param('tripId') tripId: TripID,
  ): Promise<TripStopResDto> {
    const result = await this.tripStopsService.createStop(userData, dto, tripId);
    return TripStopMapper.toResDto({ ...result, trip_id: tripId });
  }

  @ApiBearerAuth()
  @Patch(':tripStopId')
  public async updateStop(
    @CurrentUser() userData: IUserData,
    @Body() dto: TripStopUpdateReqDto,
    @Param('tripStopId') tripStopId: TripStopID,
  ): Promise<TripStopResDto> {
    const result = await this.tripStopsService.updateStop(userData, dto, tripStopId);
    return TripStopMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete(':tripStopId')
  public async deleteStop(
    @CurrentUser() userData: IUserData,
    @Param('tripStopId') tripStopId: TripStopID,
  ): Promise<void> {
    await this.tripStopsService.deleteStop(userData, tripStopId);
  }

  @ApiBearerAuth()
  @Get(':tripStopId')
  public async getStopById(
    @CurrentUser() userData: IUserData,
    @Param('tripStopId') tripStopId: TripStopID,
  ): Promise<TripStopResDto> {
    const result = await this.tripStopsService.getTripStopById(userData, tripStopId);
    return TripStopMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiFile('image', false, true)
  @Post(':tripStopId/image')
  public async uploadImage(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
    @Param('tripStopId') tripStopId: TripStopID,
  ): Promise<TripStopResDto> {
    const result = await this.tripStopsService.uploadImage(userData, file, tripStopId);
    return TripStopMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete(':tripStopId/image')
  public async deleteImage(
    @CurrentUser() userData: IUserData,
    @Param('tripStopId') tripStopId: TripStopID,
  ): Promise<void> {
    await this.tripStopsService.deleteImage(userData, tripStopId);
  }
}
