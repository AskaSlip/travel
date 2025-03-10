import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { Config } from '../../configs/config-type';
import { join } from 'path';
import * as process from 'node:process';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(configService: ConfigService<Config>) => {
        const config = configService.get('mail');
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: config.email,
              pass: config.password,
            },
          },
          defaults: {
            from: `"No Reply" <${config.email}>`,
          },
          template: {
            dir: join(process.cwd(), 'src' , 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      }
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}