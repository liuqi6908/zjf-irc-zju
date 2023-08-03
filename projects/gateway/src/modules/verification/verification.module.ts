import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VerificationHistory } from 'src/entities/verification'

import { UserModule } from '../user/user.module'
import { VerificationService } from './verification.service'
import { VerificationController } from './verification.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationHistory]),
    UserModule,
  ],
  providers: [VerificationService],
  exports: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
