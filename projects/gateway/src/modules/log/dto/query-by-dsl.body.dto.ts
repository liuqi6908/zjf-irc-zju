import { Mixin } from 'ts-mixer'
import { DslDto } from 'src/dto/dsl.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { EsPaginationDto } from 'src/dto/pagination.dto'

export class QueryByDslBodyDto extends Mixin(DslDto, EsPaginationDto) {
  @ApiPropertyOptional({
    description: '过滤返回数据的字段，如果不指定，则返回全部的字段',
    example: [
      'user.nickname',
      'user.verification.name',
      'action',
      'ip',
    ],
  })
  fields: string[]
}
