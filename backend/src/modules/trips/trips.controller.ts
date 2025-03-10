import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { TripsService } from './services/trips.service';
import { TripReqDto } from './models/dto/req/trip.req';
import { TripResDto } from './models/dto/res/trip.res.dto';
@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {
  }
//todo trip mapper
  @ApiBearerAuth()
  @Post('create-trip')
  public async createTrip(
    @CurrentUser() userData: IUserData,
    @Body() dto: TripReqDto,
  ): Promise<TripResDto> {
    return await this.tripsService.createTrip(userData, dto);
  }

}
