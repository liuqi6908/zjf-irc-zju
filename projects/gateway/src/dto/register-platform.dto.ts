import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

const registerPlatform = {
  0: '智能云科研平台',
  1: '区域发展政策大脑平台',
}

export function RegisterPlatformDecorator(isOptional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `用户注册的平台
        \n${objectEntries(registerPlatform).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}`,
        enum: [0, 1],
        example: 0,
      }),
      IsEnum([0, 1], { message: 'registerPlatform必须是 0 或 1' }),
    ],
    isOptional,
  )
}

export class RegisterPlatformDto {
  @decorate(RegisterPlatformDecorator())
  registerPlatform: 0 | 1
}

export class RegisterPlatformOptionalDto {
  @decorate(RegisterPlatformDecorator(true))
  registerPlatform?: 0 | 1
}
