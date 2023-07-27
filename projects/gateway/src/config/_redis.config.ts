import { registerAs } from '@nestjs/config';

interface RedisConnectionOptions {
  host: string;
  port: number;
  db: number;
  username?: string;
  password?: string;
}

const getUrl = (opt: RedisConnectionOptions): { key: string; url: string } => {
  const { host, port, db, username, password } = opt;
  if (!host || !port || (db !== 0 && !db)) return null;
  const auth = username ? `${username}${password ? ':' + password : ''}@` : '';
  const key = `${host}_${port}_${db}_${username || ''}`;
  const url = `redis://${auth}${host}:${port}/${db}`;
  return { key, url };
};

export default registerAs('redis', () => {
  return {
    [RedisType.AUTH_JWT]: getUrl({
      host: process.env.REDIS_AUTH_JWT_HOST,
      port: parseInt(process.env.REDIS_AUTH_JWT_PORT),
      db: parseInt(process.env.REDIS_AUTH_JWT_DB),
      username: process.env.REDIS_AUTH_JWT_USERNAME,
      password: process.env.REDIS_AUTH_JWT_PASSWORD,
    }),
  };
});
