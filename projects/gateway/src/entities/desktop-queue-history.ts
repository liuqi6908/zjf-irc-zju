import { ApiProperty } from '@nestjs/swagger'
import { DesktopQueueHistoryStatus } from 'zjf-types'
import type { IDesktopQueueHistory } from 'zjf-types'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class DesktopQueueHistory
  extends BaseTimeStamp
  implements IDesktopQueueHistory {
  @ApiProperty({ description: '历史记录的唯一标识，UUID 自动生成' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '作为外键，关联到用户表' })
  @Column()
  userId: string

  @ApiProperty({ description: '所属用户', type: () => User })
  @ManyToOne(() => User, user => user.desktopQueueHistory)
  @JoinColumn()
  user: User

  @ApiProperty({ description: '申请时间' })
  @Column()
  requestAt: Date

  @ApiProperty({ description: '申请时长，单位为天' })
  @Column()
  duration: number

  @ApiProperty({ description: '申请材料列表' })
  @Column('simple-array')
  attachments: string[]

  @ApiProperty({
    type: 'enum',
    description: '状态',
    enum: DesktopQueueHistoryStatus,
  })
  @Column({
    type: 'enum',
    enum: DesktopQueueHistoryStatus,
    default: DesktopQueueHistoryStatus.Rejected,
  })
  status: DesktopQueueHistoryStatus

  @ApiProperty({
    description: '驳回的原因',
  })
  @Column({ nullable: true })
  rejectReason?: string
}
