import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { validatePath } from '@catsjuice/utils';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import allConfig from './config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    // Internal Modules
    UserModule,

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
export class AppModule {}
