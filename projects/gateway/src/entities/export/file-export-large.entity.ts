import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FileExportLargeStatus } from 'zjf-types'
import type { IFileExportLarge } from 'zjf-types'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '../user'
import { Desktop } from '../desktop'
import { FileExportBasic } from './file-export-basic.entity'

@Entity()
export class FileExportLarge
  extends FileExportBasic
  implements IFileExportLarge {
  @ManyToOne(() => User, user => user.exportsLarge, { eager: true })
  @JoinColumn()
  founder: User

  @ApiProperty({ description: '创建者', type: () => User })
  @ManyToOne(() => User, user => user.exportsBigHandled)
  @JoinColumn()
  handler: User

  @ApiProperty({ description: '创建者的 id' })
  @Column({ nullable: true })
  handlerId: string

  @ApiProperty({ description: '处理时间' })
  @Column({ nullable: true })
  handleAt: Date

  @ApiProperty({ description: '状态' })
  @Column({
    type: 'enum',
    enum: FileExportLargeStatus,
    default: FileExportLargeStatus.Pending,
  })
  status: FileExportLargeStatus

  @ApiPropertyOptional({ description: '驳回的原因' })
  @Column({ nullable: true })
  rejectReason?: string

  @ApiPropertyOptional({ description: '发起外发的云桌面' })
  @ManyToOne(() => Desktop, desktop => desktop.exportsLarge, { onDelete: 'SET NULL' })
  desktop?: Desktop

  @ApiPropertyOptional({ description: '发起外发时所在的云桌面的 id' })
  @Column({ nullable: true })
  desktopId?: Desktop['id']
}
