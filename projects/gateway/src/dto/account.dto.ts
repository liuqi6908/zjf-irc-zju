import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import type { IAccountDto, IAccountOptionalDto } from 'zjf-types/types/dto/account.interface'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { ACCOUNT_MAX_LENGTH, ACCOUNT_MIN_LENGTH, ACCOUNT_REQUIREMENTS_DESC } from 'zjf-utils'
import { IsValidAccount } from 'src/decorators/validators/is-valid-account'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { decorate } from 'ts-mixer'

function AccountDecorator(isOptional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `账号，${ACCOUNT_REQUIREMENTS_DESC}
        ${sharedVariableMarkdown('ACCOUNT_REQUIREMENTS_DESC')}`,
        maxLength: ACCOUNT_MAX_LENGTH,
        minLength: ACCOUNT_MIN_LENGTH,
        type: () => String,
        example: 'catsjuice',
      }),
      IsValidAccount(),
      MinLength(ACCOUNT_MIN_LENGTH, { message: `账号长度不能小于${ACCOUNT_MIN_LENGTH}` }),
      MaxLength(ACCOUNT_MAX_LENGTH, { message: `账号长度不能大于${ACCOUNT_MAX_LENGTH}` }),
      IsString({ message: '账号必须是字符串' }),
    ],
    isOptional,
  )
}

export class AccountDto implements IAccountDto {
  /** 账号 */
  @decorate(AccountDecorator(false))
  account: string
}

export class AccountOptionalDto implements IAccountOptionalDto {
  /** 账号 */
  @decorate(AccountDecorator(true))
  account?: string
}
