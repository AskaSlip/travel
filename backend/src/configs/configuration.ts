import { Config } from './config-type';
import * as process from 'node:process';
//todo check if needed to delete
// export default (): Config => ({
//   app: {
//     port: parseInt(process.env.APP_PORT || '5000', 10),
//     host: process.env.APP_HOST,
//   },
//   database: {
//     host: process.env.POSTGRES_HOST,
//     port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     db: process.env.POSTGRES_DB,
//   },
//   redis: {
//     host: process.env.REDIS_HOST,
//     port: parseInt(process.env.REDIS_PORT || '6379', 10),
//     password: process.env.REDIS_PASSWORD,
//   },
//   aws: {
//     accessKey: process.env.AWS_S3_ACCESS_KEY,
//     secretKey: process.env.AWS_S3_SECRET_KEY,
//   }
// });
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
    }
});