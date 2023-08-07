import { Module, forwardRef } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { CodeModule } from '../code/code.module'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Module({
  imports: [
    forwardRef(() => UserModule),
    CodeModule,
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
