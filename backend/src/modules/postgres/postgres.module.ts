import * as path from 'node:path';
import * as process from 'node:process';

import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Config, DatabaseConfig} from "../../configs/config-type";
import {UserEntity} from "../../database/entities/user.entity";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<Config>) => {
                const config = configService.get<DatabaseConfig>('database');
                return {
                    type: 'postgres',
                    host: config?.host,
                    port: config?.port,
                    username: config?.user,
                    password: config?.password,
                    database: config?.db,
                    entities: [path.join(
                        process.cwd(),
                        'dist',
                        'src',
                        'database',
                        'entities',
                        '*.entity.js',
                    )],
                    migrations: [path.join(
                        process.cwd(),
                        'dist',
                        'src',
                        'database',
                        'migrations',
                        '*.js',
                    )],

                    synchronize: false,
                    migrationsRun: false,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class PostgresModule {}