import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'

const registerPlatform = {
  0: '智能云科研平台',
  1: '城市大脑平台',
}

export class RegisterPlatformDto {
  @decorate(ApiProperty({
    description: `用户注册的平台
    \n${objectEntries(registerPlatform).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}`,
    enum: [0, 1],
    example: 0,
  }))
  @decorate(IsEnum([0, 1], { message: 'registerPlatform必须是 0 或 1' }))
  registerPlatform: 0 | 1
}
