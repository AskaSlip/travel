import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Config, GoogleOAuthConfig } from '../../../configs/config-type';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { RoleEnum } from '../../../common/enums/role.enum';
import { RandomPasswordHelper } from '../helpers/random-password.helper';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly authService: AuthService,
  ) {
    const config = configService.get<GoogleOAuthConfig>('googleOAuth') as GoogleOAuthConfig;
    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirectUri,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    console.log({profile});
    try{
      const password = RandomPasswordHelper.generateRandomPassword();
      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        username: profile.displayName,
        password: password,
        avatar: profile.photos[0]?.value || null,
        isActive: true,
        role: RoleEnum.USER
      });

      console.log(password);
      done(null, { id: user.id });
    }catch(err){
      done(err, 'Error with google user')
    }

  }
}