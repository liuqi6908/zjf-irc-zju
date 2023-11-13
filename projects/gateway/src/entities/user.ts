import type { IUser } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import { Role } from './role'
import { Work } from './work'
import { Login } from './login'
import { Desktop } from './desktop'
import { DataRole } from './data-role'
import { BaseTimeStamp } from './_timestamp'
import { UserDeleted } from './user-deleted'
import { DesktopQueue } from './desktop-queue'
import { DataSuggestion } from './data-suggestion'
import { VerificationHistory } from './verification'
import { DesktopQueueHistory } from './desktop-queue-history'
import { FileExportSmall } from './export/file-export-small.entity'
import { FileExportLarge } from './export/file-export-large.entity'

@Entity()
@Unique(['account', 'registerPlatform'])
export class User extends BaseTimeStamp implements IUser {
  @ApiProperty({
    description: '用户的唯一标识',
    example: 'd0b0d0b0-d0b0-d0b0-d0b0-d0b0d0b0d0b0',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    description: '账号',
    example: 'catsjuice',
  })
  @Column()
  account: string

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'somebody@gmail.com',
  })
  @Column({ nullable: true })
  email?: string

  // @ApiProperty({ description: '密码（加密后）' })
  @Column({ nullable: true, select: false })
  password?: string

  @ApiProperty({
    description: '用户注册平台（0智能云科研、1区域发展政策大脑）',
  })
  @Column({ default: 0 })
  registerPlatform: 0 | 1

  @ApiPropertyOptional({ description: '用户昵称' })
  @Column({ nullable: true })
  nickname?: string

  @ApiPropertyOptional({ description: '头像地址' })
  @Column({ nullable: true })
  avatar?: string

  @Column({ select: false, default: false })
  isDeleted?: boolean

  @Column({ select: false, default: false })
  isSysAdmin: boolean

  @OneToOne(() => UserDeleted, deleted => deleted.user)
  deletedRecord?: UserDeleted

  @ManyToOne(() => Role, role => role.users, { onDelete: 'SET NULL' })
  @JoinColumn()
  role?: Role

  @ManyToOne(() => DataRole, dataRole => dataRole.users)
  @JoinColumn()
  dataRole?: DataRole

  @Column({ nullable: true })
  dataRoleName?: string

  @Column({ nullable: true })
  roleName?: string

  @OneToOne(() => VerificationHistory, vh => vh.user, { eager: true })
  @JoinColumn()
  verification?: VerificationHistory

  @Column({ nullable: true })
  verificationId?: VerificationHistory['id']

  @OneToMany(() => VerificationHistory, vh => vh.founder)
  founderVerifications?: VerificationHistory[]

  @OneToMany(() => VerificationHistory, vh => vh.handler)
  handlerVerifications?: VerificationHistory[]

  @OneToMany(() => Login, login => login.user, { cascade: true })
  logins?: Login[]

  @ApiProperty({ description: '当前分配的云桌面信息' })
  @OneToOne(() => Desktop, desktop => desktop.user)
  desktop?: Desktop

  @ApiProperty({ description: '当前用户曾使用过的云桌面列表' })
  @OneToMany(() => Desktop, desktop => desktop.lastUser)
  desktopHistories?: Desktop[]

  @ApiProperty({ description: '当前进行中的云桌面排队/申请' })
  @OneToOne(() => DesktopQueue, desktopQueue => desktopQueue.user)
  desktopQueue?: DesktopQueue

  @ApiProperty({ description: '已完成的云桌面使用（到期历史记录）' })
  @OneToMany(() => DesktopQueueHistory, dqh => dqh.user)
  desktopQueueHistory?: DesktopQueueHistory[]

  @ApiProperty({ description: '外发的小文件列表' })
  @OneToMany(() => FileExportSmall, fileExpSmall => fileExpSmall.founder)
  exportsSmall?: FileExportSmall[]

  @ApiProperty({ description: '外发的大文件列表' })
  @OneToMany(() => FileExportLarge, fileExpLarge => fileExpLarge.founder)
  exportsLarge?: FileExportLarge[]

  @ApiProperty({ description: '处理过（通过/驳回）的大文件外发列表' })
  @OneToMany(() => FileExportLarge, fileExpLarge => fileExpLarge.handler)
  exportsBigHandled?: FileExportLarge[]

  @ApiProperty({ description: '上传的作品列表' })
  @OneToMany(() => Work, work => work.user)
  works?: Work[]

  @ApiProperty({ description: '用户推荐的数据采购信息' })
  @OneToMany(() => DataSuggestion, sug => sug.user, { cascade: true })
  suggestions?: DataSuggestion[]
}
