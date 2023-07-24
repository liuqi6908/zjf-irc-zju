import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { validatePath } from '@catsjuice/utils';
import { parseBoolRaw } from './utils/parser';
import registerSwagger from './bootstrap/register-swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const packageJson = await require(path.join(__dirname, '../package.json'));
  const cfgSrv = app.get(ConfigService);
  const globalPrefix = validatePath(cfgSrv.get('SERVER_BASE_PATH') || '/');

  // Register Swagger
  if (parseBoolRaw(cfgSrv.get('SWAGGER_ENABLED')))
    await registerSwagger(app, cfgSrv, globalPrefix, packageJson.version);

  // Global variables
  global.prefix = globalPrefix;
  global.version = packageJson.version;

  // Start server
  await app.listen(parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::');
  logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
