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
    AWS_S3_BUCKET_NAME: string;
    AWS_S3_REGION: string;
    AWS_S3_ACL: string;
    AWS_S3_ENDPOINT: string;

    SENTRY_DSN: string;
    SENTRY_ENV: string;
    SENTRY_DEBUG: string;

    JWT_ACCESS_SECRET: string
    JWT_REFRESH_SECRET: string
    JWT_ACCESS_EXPIRES_IN: number
    JWT_REFRESH_EXPIRES_IN: number

    GOOGLE_CLIENT_ID: string
    GOOGLE_SECRET: string
    GOOGLE_CALLBACK_URL: string

    SMTP_EMAIL: string
    SMTP_PASSWORD: string
    EMAIL_FOR_CHECK: string
  }
}
