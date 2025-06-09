import {
  Body,
  Controller, Delete, Get, Param, Patch,
  Post, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { TripsService } from './services/trips.service';
import { TripReqDto } from './models/dto/req/trip.req';
import { TripResDto } from './models/dto/res/trip.res.dto';
import { TripID } from '../../common/types/entity-ids.type';
import { TripMapper } from './services/trip.mapper';
import { ListTripsQueryDto } from './models/dto/req/list-trips-query.dto';
import { ListTripsResDto } from './models/dto/res/list-trips.res.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../common/decorators/api-file.decorator';
import { ListTripStopsQueryDto } from '../trip-stop/models/dto/req/list-trip-stops-query.dto';
import { ListTripStopsResDto } from '../trip-stop/models/dto/res/list-trip-stops.res.dto';
import { TripStopMapper } from '../trip-stop/services/trip-stop.mapper';
import { TripBudget, TripUpdateReq } from './models/dto/req/trip-update.req';
import { ListTicketsQueryDto } from '../tickets/models/dto/req/list-tickets-query.dto';
import { ListTicketsResDto } from '../tickets/models/dto/res/list-tickets.res.dto';
import { TicketsMapper } from '../tickets/services/tickets.mapper';
import { BudgetResDto } from '../budget/models/dto/res/budget.res.dto';
import { BudgetMapper } from '../budget/services/budget.mapper';
//todo update here with role
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
    return TripMapper.toResDto({ ...result, tripStops: [], tickets: [], budgets: [] });
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

  // @ApiBearerAuth()
  // @Post('join')
  // async joinTrip(
  //   @Query('token') token: string,
  //   @CurrentUser() userData: IUserData,
  // ): Promise<{ message: string }> {
  //   await this.tripsService.joinTrip(token, userData);
  //   return { message: 'You are now an editor of this trip.' };
  // }


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
    @Body() dto: TripUpdateReq
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

  @ApiBearerAuth()
  @Get(':tripId/trip-stops')
  public async getTripStops(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
  @Query() query: ListTripStopsQueryDto
): Promise<ListTripStopsResDto> {
    const [entities, total] = await this.tripsService.getTripStops(userData, tripId, query);
    return TripStopMapper.toResDtoList(entities, total, query);
  }

  @ApiBearerAuth()
  @Get(':tripId/tickets')
  public async getTripTickets(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
    @Query() query: ListTicketsQueryDto
  ): Promise<ListTicketsResDto> {
    const [entities, total] = await this.tripsService.getTripTickets(userData, tripId, query);
    return TicketsMapper.toResDtoList(entities, total, query);
  }

  @ApiBearerAuth()
  @Get(':tripId/budget')
  public async getTripBudget(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
  ): Promise<{ data: BudgetResDto[] }> {
    const entities = await this.tripsService.getTripBudget(userData, tripId);
    return BudgetMapper.toResDtoList(entities);
  }

  @ApiBearerAuth()
  @Patch(':tripId/max-budget')
  public async assignMaxBudget(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID,
    @Body() dto: TripBudget
  ): Promise<TripBudget> {
    return await this.tripsService.assignMaxBudget(userData, tripId, dto);
  }


  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('trip_picture'))
  @ApiFile('trip_picture', false, true)
  @Post(':tripId/image')
  public async uploadImage(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
    @Param('tripId') tripId: TripID
  ): Promise<TripResDto> {
    const result = await this.tripsService.uploadImage(userData, file, tripId);
    return TripMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete(':tripId/image')
  public async deleteImage(
    @CurrentUser() userData: IUserData,
    @Param('tripId') tripId: TripID
  ): Promise<void> {
    await this.tripsService.deleteImage(userData, tripId);
  }



  // @ApiBearerAuth()
  // @Post(':tripId/invite')
  // async generateInvite(
  //   @Param('tripId') tripId: TripID,
  //   @CurrentUser() userData: IUserData,
  // ): Promise<{inviteLink: string}> {
  //   const inviteLink = await this.tripsService.generateInvite(tripId, userData);
  //   return { inviteLink };
  // }
}
