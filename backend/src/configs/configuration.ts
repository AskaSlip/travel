import { Config } from './config-type';
import * as process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default (): Config => ({
  app: {
    port: parseInt(getEnv('APP_PORT'), 10),
    host: getEnv('APP_HOST'),
  },
  database: {
    host: getEnv('POSTGRES_HOST'),
    port: parseInt(getEnv('POSTGRES_PORT'), 10),
    user: getEnv('POSTGRES_USER'),
    password: getEnv('POSTGRES_PASSWORD'),
    db: getEnv('POSTGRES_DB'),
  },
  redis: {
    host: getEnv('REDIS_HOST'),
    port: parseInt(getEnv('REDIS_PORT'), 10),
    password: getEnv('REDIS_PASSWORD'),
  },
  aws: {
    accessKey: getEnv('AWS_S3_ACCESS_KEY'),
    secretKey: getEnv('AWS_S3_SECRET_KEY'),
    bucketName: getEnv('AWS_S3_BUCKET_NAME'),
    region: getEnv('AWS_S3_REGION'),
    ACL: getEnv('AWS_S3_ACL'),
    endpoint: getEnv('AWS_S3_ENDPOINT'),
  },
    sentry: {
        dsn: getEnv('SENTRY_DSN'),
        env: getEnv('SENTRY_ENV'),
        debug: getEnv('SENTRY_DEBUG') === 'true',
    },
    jwt: {
      accessSecret: getEnv('JWT_ACCESS_SECRET'),
      accessExpiresIn: parseInt(getEnv('JWT_ACCESS_EXPIRES_IN'), 10) || 3600,
      refreshSecret: getEnv('JWT_REFRESH_SECRET'),
      refreshExpiresIn: parseInt(getEnv('JWT_REFRESH_EXPIRES_IN'), 10) || 86400,
    },
    googleOAuth: {
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_SECRET'),
      redirectUri: getEnv('GOOGLE_CALLBACK_URL'),
    },
    mail: {
      email: getEnv('SMTP_EMAIL'),
      password: getEnv('SMTP_PASSWORD'),
      emailForCheck: getEnv('EMAIL_FOR_CHECK'),
    },
});