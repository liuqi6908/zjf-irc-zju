import { join } from 'node:path'
import { BullModule } from '@nestjs/bull'
import { validatePath } from '@catsjuice/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { Module, RequestMethod } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'

import allConfig from './config'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { CmsModule } from './modules/cms/cms.module'
import { LogModule } from './modules/log/log.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { RoleModule } from './modules/role/role.module'
import { FileModule } from './modules/file/file.module'
import { DataModule } from './modules/data/data.module'
import { WorkModule } from './modules/work/work.module'
import { RedisModule } from './modules/redis/redis.module'
import { EmailModule } from './modules/email/email.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { InfoMiddleware } from './middleware/info.middleware'
import { ExportModule } from './modules/export/export.module'
import { DesktopModule } from './modules/desktop/desktop.module'
import { AccessMiddleware } from './middleware/access.middleware'
import { RequestModule } from './modules/request/request.module'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { PermissionModule } from './modules/permission/permission.module'
import { EsAnalyzerModule } from './modules/es-analyzer/es-analyzer.module'
import { DataSuggestModule } from './modules/data-suggest/data-suggest.module'
import { VerificationModule } from './modules/verification/verification.module'
import { ConfigModule as SysConfigModule } from './modules/config/config.module'

@Module({
  imports: [
    // Internal Modules
    LogModule,
    CmsModule,
    WorkModule,
    UserModule,
    AuthModule,
    RoleModule,
    FileModule,
    DataModule,
    RedisModule,
    EmailModule,
    ExportModule,
    RequestModule,
    DesktopModule,
    SysConfigModule,
    EsAnalyzerModule,
    PermissionModule,
    DataSuggestModule,
    VerificationModule,

    // External Modules
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 10, limit: 50 }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev', '.env.staging', '.env.production', '.env'],
      isGlobal: true,
      cache: true,
      load: [...allConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) =>
        _cfgSrv.get<TypeOrmModuleOptions>('db'),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) => [
        {
          rootPath: join(__dirname, 'public'),
          serveRoot: validatePath(_cfgSrv.get('SERVER_BASE_PATH')),
        },
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfgSrv: ConfigService) => ({
        redis: {
          host: cfgSrv.get('REDIS_BULL_HOST'),
          port: cfgSrv.get('REDIS_BULL_PORT'),
          db: cfgSrv.get('REDIS_BULL_DB'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InfoMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(AccessMiddleware)
      .exclude(
        { path: 'log/(.*)', method: RequestMethod.ALL },
        { path: 'email/(.*)', method: RequestMethod.ALL },
        { path: 'file/(.*)', method: RequestMethod.PUT },
      ).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
