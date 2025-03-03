import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [],
  controllers: [UsersController, AdminController],
  providers: [UsersService, AdminService],
})
export class UsersModule {}
