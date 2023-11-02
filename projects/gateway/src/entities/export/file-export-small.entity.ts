import type { IFileExportSmall } from 'zjf-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '../user'
import { Desktop } from '../desktop'
import { FileExportBasic } from './file-export-basic.entity'

@Entity()
export class FileExportSmall
  extends FileExportBasic
  implements IFileExportSmall {
  @ManyToOne(() => User, user => user.exportsSmall, { eager: true })
  @JoinColumn()
  founder: User

  @ApiPropertyOptional({ description: '发起外发的云桌面' })
  @ManyToOne(() => Desktop, desktop => desktop.exportsSmall, { onDelete: 'SET NULL' })
  @JoinColumn()
  desktop?: Desktop

  @ApiPropertyOptional({ description: '发起外发时所在的云桌面的 id' })
  @Column({ nullable: true })
  desktopId?: Desktop['id']
}
