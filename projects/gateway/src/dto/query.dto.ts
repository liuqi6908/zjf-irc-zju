import { decorate } from 'ts-mixer'
import type { IQueryConfig, IQueryResDto, IQuerySort } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

import { PaginatedResData, PaginationDto } from './pagination.dto'
import { SuccessDto } from './success.dto'

class QueryFilter {
  @ApiProperty({ description: '字段名' })
  field: string

  @ApiProperty({ description: '过滤类型' })
  type: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'BETWEEN' | 'IS NULL' | 'IS NOT NULL' | 'IN' | 'NOT IN' | 'LIKE' | 'NOT LIKE'

  @ApiProperty({ description: '过滤值' })
  value: any
}

class QuerySort implements IQuerySort {
  @ApiProperty({ description: '字段名' })
  field: string

  @ApiProperty({ description: '排序类型，`ASC` | `DESC`' })
  order: 'ASC' | 'DESC'
}

export class QueryDto<T> implements IQueryConfig<T> {
  @decorate(ApiPropertyOptional({ type: () => PaginationDto }))
  pagination?: PaginationDto

  @decorate(ApiProperty({
    type: () => [QueryFilter],
    description: '过滤组合，已定义类型，请直接使用 IQueryFilter 类型' + `\n${sharedVariableMarkdown('IQueryFilter', 'zjf-types', '类型定义')}`,
  }))
  filters?: Array<QueryFilter>

  @decorate(ApiProperty({
    type: () => [QuerySort],
    description: '排序组合，已定义类型，请直接使用 IQuerySort 类型' + `\n${sharedVariableMarkdown('IQuerySort', 'zjf-types', '类型定义')}`,
  }))
  sort?: Array<QuerySort>

  @decorate(ApiProperty({
    type: () => Object,
    description: '关联组合，已定义类型，请直接使用 RelationSet 类型' + `\n${sharedVariableMarkdown('RelationSet', 'zjf-types', '类型定义')}`,
  }))
  relations?: Record<string, any>
}

export class QueryResDto<T> extends SuccessDto<PaginatedResData<T>> implements IQueryResDto<T> {
  @decorate(ApiProperty({
    type: () => PaginatedResData,
    description: `这是通用的分页查询返回，返回的结构为统一的分页结果类型，请直接使用 \`zjf-types\` 中定义的类型来做类型约束\n${
      sharedVariableMarkdown('IPaginatedResData', 'zjf-types', '响应结果类型定义')
    }\n或者使用整个响应的类型定义${
      sharedVariableMarkdown('IQueryResDto', 'zjf-types', '响应结果类型定义')
    }`,
  }))
  data: PaginatedResData<T>
}
