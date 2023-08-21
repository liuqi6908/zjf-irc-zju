import { Mixin } from 'ts-mixer'
import { DslDto } from 'src/dto/dsl.dto'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { dimensions } from '../config/dimension'

const dimensionMarkdown = dimensions.map(d => `- ${d.id} - ${d.name}`).join('\n')
const dimensionEnum = dimensions.map(d => d.id)

export class AggLogBodyDto extends Mixin(DslDto) {
  @ApiProperty({
    description: `聚合维度\n${dimensionMarkdown}`,
    example: 'D_YEAR',
    enum: dimensionEnum,
  })
  @IsEnum(dimensionEnum)
  dimension: string
}
