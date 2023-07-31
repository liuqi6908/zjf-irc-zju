import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from 'src/entities/role'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
  ],
})
export class RoleModule {}
