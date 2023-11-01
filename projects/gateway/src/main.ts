import * as path from 'node:path'
import { NestFactory } from '@nestjs/core'
import compression from '@fastify/compress'
import { ConfigService } from '@nestjs/config'
import { validatePath } from '@catsjuice/utils'
import { Logger, ValidationPipe } from '@nestjs/common'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import fmp from '@fastify/multipart'
import * as cors from 'cors'

import {
  FastifyAdapter,
} from '@nestjs/platform-fastify'
import registerSwagger from './bootstrap/register-swagger'

import { AppModule } from './app.module'
import { parseBoolRaw } from './utils/parser'
import { getExceptionFactory } from './utils/response/validate-exception-factory'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const packageJson = await require(path.join(__dirname, '../package.json'))
  const cfgSrv = app.get(ConfigService)
  const globalPrefix = validatePath(cfgSrv.get('SERVER_BASE_PATH') || '/')
  await app.setGlobalPrefix(globalPrefix)

  // Register Swagger
  if (parseBoolRaw(cfgSrv.get('SWAGGER_ENABLED')))
    await registerSwagger(app, cfgSrv, globalPrefix, packageJson.version)

  /** 启用 压缩 */
  app.register(compression)
  /** 文件 */
  app.register(fmp, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 1024 * 1024 * 1024,
    },
  })

  /** 启用 validation */
  app.useGlobalPipes(
    new ValidationPipe({ exceptionFactory: getExceptionFactory() }),
  )

  // Global variables
  globalThis.prefix = globalPrefix
  globalThis.version = packageJson.version

  app.use(cors())

  // Start server
  await app.listen(Number.parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::')
  logger.log(`App is running on ${await app.getUrl()}`)
}
bootstrap()
