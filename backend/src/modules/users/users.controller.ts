import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UsersService } from './services/users.service';
import {UserID} from "../../common/types/entity-ids.type";
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { UserBaseResDto } from './models/dto/res/user-base.res.dto';
import { UserMapper } from './services/user.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ){
    return await this.usersService.findMe(userData)
  }

  @ApiBearerAuth()
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserReqDto) {
    return await this.usersService.updateMe(userData, dto);
  }

  @ApiBearerAuth()
  @Delete('me')
  public async removeMe(@Param('userId') userId: UserID) {
    return await this.usersService.removeMe(userId);
  }

  @SkipAuth()
  @Get(':userId')
  public async findOne(@Param('userId', ParseUUIDPipe) userId: UserID): Promise<UserBaseResDto> {
    const result =  await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }
}
