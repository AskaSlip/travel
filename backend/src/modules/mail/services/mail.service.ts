import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRepository } from '../../repository/services/user.repository';
import { ConfigService } from '@nestjs/config';
import { Config, JwtConfig, MailConfig } from '../../../configs/config-type';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    //config only for testing purposes
    private readonly configService: ConfigService<Config>,
  ) {}

  public async sendResetPassword(email: string){
    const mailConfig = this.configService.get<MailConfig>('mail');
    const jwtConfig = this.configService.get<JwtConfig>('jwt') as JwtConfig;
    const user = await this.userRepository.findOneBy({ email });
    if(!user){
      throw new BadRequestException('User with this email does not exist');
    }

    const token = jwt.sign({email}, jwtConfig.accessSecret, {expiresIn: '1h'});
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: mailConfig?.emailForCheck,
      subject: 'Reset password',
      template: 'reset-password',
      context: {
        resetLink
      }
    })


  }

}