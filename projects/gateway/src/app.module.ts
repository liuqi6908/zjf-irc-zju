import { join } from 'node:path'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { validatePath } from '@catsjuice/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, RequestMethod } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'

import allConfig from './config'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { RedisModule } from './modules/redis/redis.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { ResponseInterceptor } from './interceptors/response.interceptor'

@Module({
  imports: [
    // Internal Modules
    UserModule,
    AuthModule,
    RedisModule,

    // External Modules
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev', '.env.production', '.env'],
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
