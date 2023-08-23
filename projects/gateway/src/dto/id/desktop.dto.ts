import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { decorate } from 'ts-mixer'

function D(o = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '云桌面 ID' }),
    IsString(),
  ], o)
}

export class DesktopIdDto {
  @decorate(D())
  desktopId: string
}

export class DesktopIdOptionalDto {
  @decorate(D(true))
  desktopId?: string
}
