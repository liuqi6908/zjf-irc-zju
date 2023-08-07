import { User } from 'src/entities/user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { UserDeleted } from 'src/entities/user-deleted'

import { CodeModule } from '../code/code.module'
import { AuthModule } from '../auth/auth.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDeleted]),
    CodeModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
