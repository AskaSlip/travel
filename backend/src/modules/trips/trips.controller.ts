import {
  Body,
  Controller, Delete, Get, Param, Patch,
  Post, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { TripsService } from './services/trips.service';
import { TripReqDto } from './models/dto/req/trip.req';
import { TripResDto } from './models/dto/res/trip.res.dto';
import { TripID } from '../../common/types/entity-ids.type';
import { TripMapper } from './services/trip.mapper';
import { ListTripsQueryDto } from './models/dto/req/list-trips-query.dto';
import { ListTripsResDto } from './models/dto/res/list-trips.res.dto';
//todo update here with roles
@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {
  }

  @ApiBearerAuth()
  @Post('create-trip')
  public async createTrip(
    @CurrentUser() userData: IUserData,
    @Body() dto: TripReqDto,
  ): Promise<TripResDto> {
    const result = await this.tripsService.createTrip(userData, dto);
    return TripMapper.toResDto({ ...result, tripStops: [] });
  }

  //trips by user
  @ApiBearerAuth()
  @Get('my-trips')
  public async getMyTrips(
    @CurrentUser() userData: IUserData,
    @Query() query: ListTripsQueryDto
  ): Promise<ListTripsResDto> {
    const [entities, total] = await this.tripsService.getMyTrips(userData, query);
    return TripMapper.toResDtoList(entities, total, query);
  }

  //trips all by admin
  @ApiBearerAuth()
  @Get('all-trips')
  public async getAllTrips(
    @CurrentUser() userData: IUserData,
    @Query() query: ListTripsQueryDto
  ): Promise<ListTripsResDto> {
    const [entities, total] = await this.tripsService.getAllTrips(userData, query);
    return TripMapper.toResDtoList(entities, total, query);
  }

//user
  @ApiBearerAuth()
  @Delete(':tripId')
  public async deleteTripById(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID
  ): Promise<void> {
    await this.tripsService.deleteTripById(userData, tripId);
  }

//user
  @ApiBearerAuth()
  @Get(':tripId')
  public async getTripById(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID
  ): Promise<TripResDto> {
    const result = await this.tripsService.getTripById(userData, tripId);
    return TripMapper.toResDto(result);
  }

//user
  @ApiBearerAuth()
  @Patch(':tripId')
  public async updateTripById(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
    @Body() dto: TripReqDto
  ) {
    const result = await this.tripsService.updateTripById(userData, tripId, dto);
    return TripMapper.toResDto(result);
  }

//admin
  @ApiBearerAuth()
  @Get('admin/:tripId')
  public async getTripByIdAdmin(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID
  ): Promise<TripResDto> {
    const result = await this.tripsService.getTripById(userData, tripId);
    return TripMapper.toResDto(result);
  }

//admin
  @ApiBearerAuth()
  @Patch(':tripId')
  public async updateTripByIdAdmin(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
    @Body() dto: TripReqDto
  ) {
    const result = await this.tripsService.updateTripById(userData, tripId, dto);
    return TripMapper.toResDto(result);
  }

//admin
  @ApiBearerAuth()
  @Delete(':tripId')
  public async deleteTripByIdAdmin(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID
  ): Promise<void> {
    await this.tripsService.deleteTripById(userData, tripId);
  }
}
