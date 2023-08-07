import { Module, forwardRef } from '@nestjs/common'
import { Login } from 'src/entities/login'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { CodeModule } from '../code/code.module'
import { EmailModule } from '../email/email.module'
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Login]),
    UserModule, CodeModule, EmailModule,
    forwardRef(() => JwtAuthModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
