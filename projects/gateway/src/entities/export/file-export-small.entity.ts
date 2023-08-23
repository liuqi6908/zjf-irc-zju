import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import type { IFileExportSmall } from 'zjf-types'

import { User } from '../user'
import { FileExportBasic } from './file-export-basic.entity'

@Entity()
export class FileExportSmall
  extends FileExportBasic
  implements IFileExportSmall {
  @ManyToOne(() => User, user => user.exportsSmall, { eager: true })
  @JoinColumn()
  founder: User
}
