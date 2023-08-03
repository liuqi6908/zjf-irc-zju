import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VerificationHistory } from 'src/entities/verification'

import { VerificationService } from './verification.service'

@Module({
  imports: [TypeOrmModule.forFeature([VerificationHistory])],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
