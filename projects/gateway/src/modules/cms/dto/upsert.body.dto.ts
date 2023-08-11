import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IUpsertCmsBodyDto } from 'zjf-types'

export class UpsertCmsBodyDto<T> implements IUpsertCmsBodyDto<T> {
  @ApiProperty({ description: '内容配置' })
  @IsNotEmpty()
  json: T
}
