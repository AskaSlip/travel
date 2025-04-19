import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { SignUpReqDto } from '../models/dto/req/sign-up.req.dto';
import { SignInReqDto } from '../models/dto/req/sign-in.req.dto';
import { AuthCacheService } from './auth-cash.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenService } from './token.service';
import { UserMapper } from '../../users/services/user.mapper';
import { TokensHelper } from '../helpers/tokens.helper';
import { IUserData } from '../models/interfaces/user-data.interface';
import { TokenPairResDto } from '../models/dto/res/token-pair.res.dto';
import { UserBaseReqDto } from '../../users/models/dto/req/user-base.req';
import { RoleEnum } from '../../../common/enums/role.enum';
import { UserID } from '../../../common/types/entity-ids.type';
import { ResetPasswordReqDto } from '../models/dto/req/reset-password.req.dto';
import { EmailReqDto } from '../models/dto/req/email.req.dto';
import { ChangePasswordReqDto } from '../models/dto/req/change-password.req.dto';
import { ConfigService } from '@nestjs/config';
import { Config, JwtConfig } from '../../../configs/config-type';
import { MailService } from '../../mail/services/mail.service';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';
import { TokenExpiredError } from '@nestjs/jwt';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<Config>,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {
  }

  public async signUp(dto: SignUpReqDto): Promise<UserBaseResDto> {
    await this.isEmailExist(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );

    await this.mailService.sendConfirmationEmail(dto.email);

    return user;
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const maxAttempts = 5;
    const lockTime = 5 * 60;
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'password', 'role'],
    });
    if (!user) {
      throw new ConflictException('User with this email does not exist');
    }

    if (user.role === RoleEnum.ADMIN) {
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

      return { user: UserMapper.toResDto(userEntity), tokens, attempts: 0 };
    }


    const redisKey = `loginAttempts:${dto.email}`;
    const attempts = Number((await this.redisService.get(redisKey)) || 0);
    console.log(`Current attempts: ${attempts}`);

    const isLocked = await this.redisService.get(`lock:${dto.email}`);
    if (isLocked) {
      console.log("User is locked out.");
      throw new ForbiddenException('Too many failed attempts. Try again later.');
    }

    if (attempts >= maxAttempts) {
      await this.mailService.sendEmailAboutIncorrectPassword(dto.email);
      await this.redisService.set(`lock:${dto.email}`, "1", lockTime);
      await this.redisService.expire(`lock:${dto.email}`, lockTime);
      throw new ForbiddenException('Too many failed attempts. Try again later.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      await this.redisService.increment(redisKey);
      await this.redisService.set(redisKey, (attempts + 1).toString(), lockTime);
      throw new UnauthorizedException('Password is incorrect');
    }
    await this.redisService.deleteByKey(redisKey);
    await this.redisService.deleteByKey(`lock:${dto.email}`);


      await this.userRepository.update(user.id, { role: RoleEnum.USER });


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
    return { user: UserMapper.toResDto(userEntity), tokens, attempts};
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

    // const tokens = await TokensHelper.generateAndSaveTokens(
    //   this.tokenService,
    //   this.authCacheService,
    //   this.refreshTokenRepository,
    //   userData.userId,
    // );
    // return tokens;
     return await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      userData.userId);
  }

  public async validateGoogleUser(googleUser: UserBaseReqDto) {
    const user = await this.userRepository.findOneBy({ email: googleUser.email });
    if (user) return user;

    const userEntity = this.userRepository.create({
      ...googleUser,
      password: await bcrypt.hash(googleUser.password, 10),
      role: RoleEnum.USER,
      isVerify: true,
    });
    return await this.userRepository.save(userEntity);
  }

  public async tokensForGoogle(id: UserID): Promise<TokenPairResDto> {
    return await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      id,
    );
  }

  public async changePassword(userData: IUserData, dto: ChangePasswordReqDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new ConflictException('New password should be different from the old one');
    }

    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(user.id, { password: newPassword });

  }


  public async forgotPassword(dto: EmailReqDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    await this.mailService.sendResetPassword(dto.email);

  }

  public async resetPassword(dto: ResetPasswordReqDto): Promise<string> {
    const config = this.configService.get<JwtConfig>('jwt') as JwtConfig;
    try {
      const decoded: any = jwt.verify(dto.resetToken, config.accessSecret);
      const email = decoded.email;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const newPassword = await bcrypt.hash(dto.password, 10);
      await this.userRepository.update(user.id, { password: newPassword });

      return 'Password reset successfully';
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public async verifyEmail(token: string): Promise<AuthResDto> {
    const config = this.configService.get<JwtConfig>('jwt') as JwtConfig;

    try {
      const decoded: any = jwt.verify(token, config.accessSecret);
      const email = decoded.email;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new ConflictException('User not found');
      }
      if (user.isVerify) {
        throw new ConflictException('Email is already verified');
      }

      await this.userRepository.update(user.id, { isVerify: true, role: RoleEnum.USER });

      const tokens = await TokensHelper.generateAndSaveTokens(
        this.tokenService,
        this.authCacheService,
        this.refreshTokenRepository,
        user.id,
      );
      return { user: UserMapper.toResDto(user), tokens };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new GoneException('Verification link has expired');
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public async resendConfirmation(email: string): Promise<void> {

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.isVerify) {
      throw new ConflictException('Email is already verified');
    }
    await this.mailService.sendConfirmationEmail(email);

  }


  private async isEmailExist(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exist');
    }
  }
}