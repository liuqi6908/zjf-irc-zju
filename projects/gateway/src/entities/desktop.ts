import type { IDesktop } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'
import { FileExportLarge } from './export/file-export-large.entity'
import { FileExportSmall } from './export/file-export-small.entity'

@Entity()
export class Desktop
  extends BaseTimeStamp
  implements IDesktop {
  @ApiProperty({ description: '云桌面ID，需要管理员手动填写虚拟机的 id' })
  @PrimaryColumn()
  id: string

  @ApiProperty({ description: '内网地址' })
  @Column()
  internalIp: string

  @ApiProperty({ description: '访问地址' })
  @Column()
  accessUrl: string

  @ApiProperty({ description: '账号' })
  @Column()
  account: string

  @ApiProperty({ description: '密码' })
  @Column()
  password: string

  @ApiProperty({ description: '到期时间' })
  @Column()
  expiredAt: Date

  @ApiProperty({ description: '云桌面当前绑定的用户', type: () => User })
  @OneToOne(() => User, user => user.desktop)
  @JoinColumn()
  user?: User

  @ApiProperty({ description: '云桌面当前绑定的用户 ID' })
  @Column({ nullable: true })
  userId?: User['id']

  @ApiProperty({ description: '上一个使用该云桌面的用户', type: () => User })
  @ManyToOne(() => User, user => user.desktopHistories)
  @JoinColumn()
  lastUser?: User

  @ApiProperty({ description: '上一个使用该云桌面的用户 ID' })
  @Column({ nullable: true })
  lastUserId?: User['id']

  @ApiProperty({ description: '云桌面是否已禁用' })
  @Column({ nullable: true, default: false })
  disabled?: boolean

  @ApiProperty({ description: '该云桌面上的大文件外发记录' })
  @OneToMany(() => FileExportLarge, feLg => feLg.desktop, { onDelete: 'SET NULL' })
  exportsLarge?: FileExportLarge[]

  @ApiProperty({ description: '该云桌面上的小文件外发记录' })
  @OneToMany(() => FileExportSmall, feSm => feSm.desktop, { onDelete: 'SET NULL' })
  exportsSmall?: FileExportSmall[]
}
