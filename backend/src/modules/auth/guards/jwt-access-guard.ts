import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {TokenService} from "../services/token.service";
import {AuthCacheService} from "../services/auth-cash.service";
import {UserRepository} from "../../repository/services/user.repository";
import {UserMapper} from "../../users/services/user.mapper";
import {TokenType} from "../models/enums/token-type.enum";
import {SKIP_AUTH} from "../decorators/skip-auth.decorator";

@Injectable()
export class JwtAccessGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly authCacheService: AuthCacheService,
        private readonly userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skipAuth) return true;

        const request = context.switchToHttp().getRequest();
        const accessToken = request.get('Authorization')?.split('Bearer ')[1];

        if (!accessToken) {
            throw new UnauthorizedException('Token not here');
        }

        const payload = await this.tokenService.verifyToken(
            accessToken,
            TokenType.ACCESS,
        );
        if (!payload) {
            throw new UnauthorizedException();
        }
        const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
            payload.userId,
            accessToken,
        );
        if (!isAccessTokenExist) {
            throw new UnauthorizedException('Token not found');
        }
        const user = await this.userRepository.findOneBy({
            id: payload.userId,
        });
        console.log(user);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        request.res.locals.user = UserMapper.toIUserData(user, payload);
        return true;
    }
}