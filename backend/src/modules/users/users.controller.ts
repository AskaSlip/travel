import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseUUIDPipe,
  Patch, Post, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UsersService } from './services/users.service';
import {UserID} from "../../common/types/entity-ids.type";
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { UserBaseResDto } from './models/dto/res/user-base.res.dto';
import { UserMapper } from './services/user.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../common/decorators/api-file.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<UserBaseResDto> {
    const result = await this.usersService.findMe(userData)
    return UserMapper.toResDto(result);
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false, true)
  @Post('me/avatar')
public async uploadAvatar(
  @CurrentUser() userData: IUserData,
  @UploadedFile() file: Express.Multer.File,
  ): Promise<UserBaseResDto> {
     const result = await this.usersService.uploadAvatar(userData, file);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete('me/avatar')
  public async deleteAvatar(
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.usersService.deleteAvatar(userData);
  }


  @SkipAuth()
  @Get(':userId')
  public async findOne(@Param('userId', ParseUUIDPipe) userId: UserID): Promise<UserBaseResDto> {
    const result =  await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }
}
