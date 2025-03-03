import {
  Body,
  Controller,
  Get,
  Post, Query,
} from '@nestjs/common';
import { ApiTags} from '@nestjs/swagger';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { AdminService } from './services/admin.service';
import { AdminBaseResDto } from './models/dto/res/admin-base.res.dto';
import { AdminBaseReqDto } from './models/dto/req/admin-base.req.dto';
import { ListUserQueryDto } from './models/dto/req/list-user-query.dto';
import { ListUserResDto } from './models/dto/res/list-user.res.dto';
import { UserMapper } from './services/user.mapper';

@ApiTags('users')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @SkipAuth()
  @Post('create-admin')
  public async createAdmin(
    @Body() dto: AdminBaseReqDto
  ): Promise<AdminBaseResDto> {
    return await this.adminService.createAdmin(dto)
  }

  @SkipAuth()
  @Get('users')
  public async getAllUsers(
    @Query() query: ListUserQueryDto
  ):Promise<ListUserResDto> {
    const [entities, total] = await this.adminService.getAllUsers(query);
    return UserMapper.toResDtoList(entities, total, query);
  }
}
