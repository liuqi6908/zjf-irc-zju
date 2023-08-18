import type { IUser } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Role } from './role'
import { BaseTimeStamp } from './_timestamp'
import { UserDeleted } from './user-deleted'
import { VerificationHistory } from './verification'
import { Login } from './login'
import { DataRole } from './data-role'

@Entity()
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
    uniqueItems: true,
  })
  @Column({ unique: true })
  account: string

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'somebody@gmail.com',
  })
  @Column({ nullable: true, unique: true })
  email?: string

  // @ApiProperty({ description: '密码（加密后）' })
  @Column({ select: false })
  password: string

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
}
