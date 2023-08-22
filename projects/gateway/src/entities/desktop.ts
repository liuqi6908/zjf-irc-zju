import type { IDesktop } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

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
  @OneToOne(() => User)
  @JoinColumn()
  user?: User

  @Column({ nullable: true })
  userId?: User['id']
}
