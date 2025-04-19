import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [AuthModule, FileStorageModule],
  controllers: [UsersController, AdminController],
  providers: [UsersService, AdminService],
})
export class UsersModule {}
