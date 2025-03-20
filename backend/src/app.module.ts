import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { UsersModule } from './modules/users/users.module';

import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { LoggerModule } from './modules/logger/logger.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { TripsModule } from './modules/trips/trips.module';
import { TripStopsModule } from './modules/trip-stop/trip-stops.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: 'backend/.env',
    }),

    AuthModule,
    RepositoryModule,
    PostgresModule,
    RedisModule,
    LoggerModule,
    UsersModule,
    MailModule,
    TripsModule,
    TripStopsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
}
