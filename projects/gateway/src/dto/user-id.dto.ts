import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import type { IUserIdDto, IUserIdOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function UserIdDecorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '用户的唯一标识', type: () => String }),
  ], optional)
}

export class UserIdDto implements IUserIdDto {
  @decorate(UserIdDecorator(false))
  userId!: string
}

export class UserIdOptionalDto implements IUserIdOptionalDto {
  @decorate(UserIdDecorator(true))
  userId?: string
}
