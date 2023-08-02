import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { CodeModule } from '../code/code.module'
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, JwtAuthModule, CodeModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
