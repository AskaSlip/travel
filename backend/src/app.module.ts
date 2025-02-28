import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';

import configuration from './configs/configuration';
import {UsersModule} from "./modules/users/users.module";

import {PostgresModule} from "./modules/postgres/postgres.module";
import {RedisModule} from "./modules/redis/redis.module";
import {APP_FILTER} from "@nestjs/core";
import {GlobalExceptionFilter} from "./common/filters/global-exception-filter";
import {SentryModule} from "@sentry/nestjs/setup";
import {LoggerModule} from "./modules/logger/logger.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: 'backend/.env',
    }),

    PostgresModule,
      RedisModule,
      LoggerModule,
    UsersModule,
  ],
  providers: [
      {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  }
  ]
})
export class AppModule {}
