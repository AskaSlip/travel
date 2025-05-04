import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { AdminService } from './services/admin.service';
import { AdminBaseResDto } from './models/dto/res/admin-base.res.dto';
import { AdminBaseReqDto } from './models/dto/req/admin-base.req.dto';
import { ListUserQueryDto } from './models/dto/req/list-user-query.dto';
import { ListUserResDto } from './models/dto/res/list-user.res.dto';
import { UserMapper } from './services/user.mapper';
import { JwtAccessGuard } from '../auth/guards/jwt-access-guard';
import { RolesGuard } from '../roles/role.guard';
import { RoleEnum } from '../../common/enums/role.enum';
import { Roles } from '../roles/decorators/roles.decorator';

@ApiTags('admin')
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


  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('users')
  public async getAllUsers(
    @Query() query: ListUserQueryDto
  ):Promise<ListUserResDto> {
    const [entities, total] = await this.adminService.getAllUsers(query);
    return UserMapper.toResDtoList(entities, total, query);
  }


}
