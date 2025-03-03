import {Module} from "@nestjs/common";
import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";
import {Config, RedisConfig} from "../../configs/config-type";
import {RedisService} from "./services/redis.service";
import {REDIS_CLIENT} from "./models/redis.constants";

@Module({
    providers: [
        {
            provide: (REDIS_CLIENT),
            useFactory: (configService: ConfigService<Config>) => {
                const config = configService.get<RedisConfig>('redis');
                return new Redis({
                    port: config?.port,
                    host: config?.host,
                    password: config?.password,
                });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [RedisService],
})

export class RedisModule {}