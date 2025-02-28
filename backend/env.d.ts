declare namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;
    APP_HOST: string;

    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;

    AWS_S3_ACCESS_KEY: string;
    AWS_S3_SECRET_KEY: string;

    SENTRY_DSN: string;
    SENTRY_ENV: string;
    SENTRY_DEBUG: string;
  }
}
