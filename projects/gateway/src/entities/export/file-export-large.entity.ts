import type { IFileExportLarge } from 'zjf-types'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '../user'
import { FileExportBasic } from './file-export-basic.entity'

@Entity()
export class FileExportLarge
  extends FileExportBasic
  implements IFileExportLarge {
  @ManyToOne(() => User, user => user.exportsLarge, { eager: true })
  @JoinColumn()
  founder: User

  @ManyToOne(() => User, user => user.exportsBigHandled)
  @JoinColumn()
  handler: User

  @Column({ nullable: true })
  handlerId: string

  @Column({ nullable: true })
  handleAt: Date
}
