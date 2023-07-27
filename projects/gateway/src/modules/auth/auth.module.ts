import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
