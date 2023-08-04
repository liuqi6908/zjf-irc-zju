import type { IQueryConfig, IQuerySort } from 'zjf-types'
import { decorate } from 'ts-mixer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { PaginationDto } from './pagination.dto'

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
