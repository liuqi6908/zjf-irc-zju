import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { DesktopQueueStatus } from 'zjf-types'
import type { IDesktopQueue } from 'zjf-types'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class DesktopQueue
  extends BaseTimeStamp
  implements IDesktopQueue {
  @ApiProperty({
    description: '用户信息',
    type: () => User,
  })
  @OneToOne(() => User, user => user.desktopQueue)
  @JoinColumn()
  user: User

  @PrimaryColumn()
  @ApiProperty({ description: '申请人id' })
  userId: string

  @ApiProperty({
    description: '队列状态',
    type: 'enum',
    enum: DesktopQueueStatus,
    default: DesktopQueueStatus.Pending,
  })
  @Column({
    type: 'enum',
    enum: DesktopQueueStatus,
    default: DesktopQueueStatus.Pending,
  })
  status: DesktopQueueStatus

  @ApiProperty({ description: '申请时间' })
  @Column()
  requestAt: Date

  @ApiProperty({ description: '开始排队的时间' })
  @Column({ nullable: true })
  queueAt?: Date

  @ApiProperty({ description: '申请时长，单位为天' })
  @Column()
  duration: number

  @ApiProperty({ description: '申请材料列表' })
  @Column('simple-array')
  attachments: string[]
}
