import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { AuthService } from '../auth/services/auth.service';
import { MailService } from '../mail/services/mail.service';

@Module({
  imports: [AuthModule, FileStorageModule],
  controllers: [UsersController, AdminController],
  providers: [UsersService, AdminService, MailService],
})
export class UsersModule {}
