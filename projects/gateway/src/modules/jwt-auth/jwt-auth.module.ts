import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { JwtAuthService } from './jwt-auth.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_: ConfigService) => {
        // https://github.com/nestjs/jwt/blob/master/README.md
        return {}
      },
    }),
  ],
  providers: [JwtAuthService, JwtService],
  exports: [JwtAuthService, JwtService],
})
export class JwtAuthModule {}
