import { Role } from 'src/entities/role'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { RoleService } from './role.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    UserModule,
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
