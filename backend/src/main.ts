import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { SwaggerHelper } from './common/helpers/swagger.helper';
import { AppConfig } from './configs/config-type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('Travel Planner')
    .setDescription('API description perhaps for me only')
    .setVersion('1.0')
    .addBearerAuth({
      in: 'header',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 7,
      persistAuthorization: true,
      //TODO: add OAuth2
      // initOAuth: {
      //   clientId: "your-client-id",
      //   clientSecret: "your-client-secret-if-required",
      //   realm: "your-realms",
      //   appName: "your-app-name",
      //   scopeSeparator: " ",
      //   scopes: "openid profile",
      //   additionalQueryStringParams: {test: "hello"},
      //   useBasicAuthenticationWithAccessCodeGrant: true,
      //   usePkceWithAuthorizationCodeGrant: true
      // }
    },
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  await app.listen(appConfig?.port || 5000, () => {
    console.log(
      `App  is running on http://${appConfig?.host}:${appConfig?.port}`,
    );
    console.log(
      `Swagger is running on http://${appConfig?.host}:${appConfig?.port}/docs`,
    );
  });
}
void bootstrap();
