import type { ICms } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryColumn } from 'typeorm'

import { BaseTimeStamp } from './_timestamp'

@Entity()
export class Cms<T> extends BaseTimeStamp implements ICms<T> {
  @ApiProperty({ description: '内容的唯一标识' })
  @PrimaryColumn()
  id: string

  @ApiProperty({ description: '内容配置' })
  @Column({ type: 'json', nullable: true })
  json?: T

  @ApiProperty({ description: '最后一次修改的用户的 id' })
  @Column()
  lastUpdatedBy: string
}
