import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<Config>,
    private readonly mailService: MailService,
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

  public async validateGoogleUser(googleUser:UserBaseReqDto){
    const user = await this.userRepository.findOneBy({ email: googleUser.email });
    if(user) return user;

    const userEntity = this.userRepository.create({
      ...googleUser,
      password: await bcrypt.hash(googleUser.password, 10),
      role: RoleEnum.USER,
      isActive: true,
    });
    return await this.userRepository.save(userEntity);
  }

  public async tokensForGoogle(id: UserID): Promise<TokenPairResDto>{
    const tokens = await TokensHelper.generateAndSaveTokens(
      this.tokenService,
      this.authCacheService,
      this.refreshTokenRepository,
      id,
    );
    return tokens;
  }

  public async changePassword(userData: IUserData, dto: ChangePasswordReqDto): Promise<{message: string}> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new ConflictException('Password is incorrect');
    }

    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(user.id, { password: newPassword });


    return {message: 'Password changed successfully'};
  }


  public async forgotPassword(dto: EmailReqDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
      await this.mailService.sendResetPassword(dto.email)

  }

  //todo перевірка чи новий пароль не співпадає зі старим
  public async resetPassword(dto: ResetPasswordReqDto): Promise<string> {
    const config = this.configService.get<JwtConfig>('jwt') as JwtConfig;
    try{
      const decoded: any = jwt.verify(dto.resetToken, config.accessSecret)
      const email = decoded.email;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new ConflictException('User not found');
      }

      const newPassword = await bcrypt.hash(dto.password, 10);
      await this.userRepository.update(user.id, { password: newPassword });

      return 'Password reset successfully';
    }catch(e){
      throw new UnauthorizedException('Invalid or expired token');
    }


  }

  private async isEmailExist(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exist');
    }
  }
}