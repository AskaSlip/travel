import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./services/auth.service";
import {RedisModule} from "../redis/redis.module";
import {AuthCacheService} from "./services/auth-cash.service";
import {TokenService} from "./services/token.service";
import {JwtModule} from "@nestjs/jwt";
import {JwtAccessGuard} from "./guards/jwt-access-guard";
import {APP_GUARD} from "@nestjs/core";
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [RedisModule, JwtModule],
    controllers: [AuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAccessGuard
        },
        AuthService,
        AuthCacheService,
        TokenService,
        JwtRefreshGuard,
        GoogleStrategy,

    ],
    exports: []
})

export class AuthModule {}