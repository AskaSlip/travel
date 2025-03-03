import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { SignUpReqDto } from '../models/dto/req/sign-up.req.dto';
import { SignInReqDto } from '../models/dto/req/sign-in.req.dto';
import { AuthCacheService } from './auth-cash.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserMapper } from '../../users/services/user.mapper';
import { TokensHelper } from '../helpers/tokens.helper';
import { IUserData } from '../models/interfaces/user-data.interface';
import { TokenPairResDto } from '../models/dto/res/token-pair.res.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {
  }

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.isEmailExist(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );

    const tokens = await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      user.id,
    );
    return { user: UserMapper.toResDto(user), tokens };
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new ConflictException('User with this email does not exist');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Password is incorrect');
    }
    const tokens = await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      user.id,
    );

    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    if (!userEntity) {
      throw new ConflictException('User not found');
    }
    return { user: UserMapper.toResDto(userEntity), tokens };

  }

  public async signOut(userData: IUserData): Promise<string> {
    await TokensHelper.deleteTokens(
      this.authCacheService,
      this.refreshTokenRepository,
      userData.userId);
    return `User ${userData.userId} signed out`;
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await TokensHelper.deleteTokens(
      this.authCacheService,
      this.refreshTokenRepository,
      userData.userId);
    const tokens = await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      userData.userId,
    );
    return tokens;
  }

  private async isEmailExist(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exist');
    }
  }
}