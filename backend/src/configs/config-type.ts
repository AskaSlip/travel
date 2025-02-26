export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  db: string;
};

export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};
