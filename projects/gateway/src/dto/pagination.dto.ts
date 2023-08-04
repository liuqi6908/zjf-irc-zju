import { decorate } from 'ts-mixer'
import type { IPaginationDto } from 'zjf-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { PAGINATION_SIZE_DFT, PAGINATION_SIZE_MAX } from 'zjf-types'

export class PaginationDto implements IPaginationDto {
  @decorate(ApiPropertyOptional({
    description: '页码',
  }))
  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Min(1))
  page?: number

  @decorate(ApiPropertyOptional({
    description: '每页的数量',
    maximum: PAGINATION_SIZE_MAX,
    default: PAGINATION_SIZE_DFT,
  }))
  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Max(PAGINATION_SIZE_MAX))
  pageSize?: number
}

export class PaginatedResData<T> {
  @decorate(ApiPropertyOptional({ description: '页码' }))
  page: number

  @decorate(ApiPropertyOptional({ description: '每页的数量' }))
  pageSize: number

  @decorate(ApiPropertyOptional({ description: '总数' }))
  total: number

  @decorate(ApiPropertyOptional({ description: '数据' }))
  data: T[]
}
