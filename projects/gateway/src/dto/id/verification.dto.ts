import { decorate } from 'ts-mixer'
import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import type { IVerificationIdDto, IVerificationIdOptionalDto } from 'zjf-types'

function VerificationParams(isOptional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '身份认证申请记录的唯一标识' }),
    IsUUID('4', { message: '非合法的 id' }),
  ], isOptional)
}

export class VerificationIdDto implements IVerificationIdDto {
  @decorate(VerificationParams())
  verificationId: string
}

export class VerificationIdOptionalDto implements IVerificationIdOptionalDto {
  @decorate(VerificationParams(true))
  verificationId?: string
}
