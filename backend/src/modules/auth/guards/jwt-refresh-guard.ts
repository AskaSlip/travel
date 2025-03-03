import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { TokenType } from '../models/enums/token-type.enum';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const isRefreshTokenExist = await this.refreshTokenRepository.isRefreshTokenExist( refreshToken );
    if (!isRefreshTokenExist) {
      throw new UnauthorizedException('Refresh token does not exist');
    }
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    request.res.locals.user = UserMapper.toIUserData(user, payload);
    return true;
  }
}