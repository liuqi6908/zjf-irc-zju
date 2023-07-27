import { Module } from '@nestjs/common'
import { User } from 'src/entities/user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserDeleted } from 'src/entities/user-deleted'

import { UserService } from './user.service'
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDeleted])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
