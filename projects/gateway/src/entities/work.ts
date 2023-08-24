import type { IWork } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class Work
  extends BaseTimeStamp
  implements IWork {
  @ApiProperty({ description: '作品唯一标识' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '作品文件名' })
  @Column({ unique: true })
  filename: string

  @ApiProperty({ description: '作品所属用户' })
  @ManyToOne(() => User, user => user.works)
  @JoinColumn()
  user: User

  @ApiProperty({ description: '作品所属用户的 id' })
  @Column()
  userId: string

  @ApiProperty({ description: '作品题目' })
  @Column()
  title: string

  @ApiProperty({ description: '作品作者' })
  @Column()
  author: string
}
