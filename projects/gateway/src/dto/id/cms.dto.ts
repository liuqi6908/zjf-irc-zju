import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { ICmsIdDto, ICmsIdOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { WithoutCharacters } from 'src/decorators/validators/without-characters'

function CmsIdDecorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '内容的唯一标识（不得包含特殊字符）',
      type: () => String,
    }),
    IsString(),
    WithoutCharacters(''),
  ], optional)
}

export class CmsIdDto implements ICmsIdDto {
  @decorate(CmsIdDecorator(false))
  cmsId: string
}

export class CmsIdOptionalDto implements ICmsIdOptionalDto {
  @decorate(CmsIdDecorator(true))
  cmsId?: string
}
