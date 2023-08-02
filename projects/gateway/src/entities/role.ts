import type { IRole } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'

import { Permission } from './permission'
import { User } from './user'

@Entity()
export class Role implements IRole {
  @ApiProperty({ description: '角色名称' })
  @PrimaryColumn()
  name: string

  @ApiProperty({ description: '角色的描述信息' })
  @Column()
  description?: string

  @ManyToMany(
    () => Permission,
    permission => permission.roles,
    { onDelete: 'CASCADE' },
  )
  @JoinTable()
  permissions?: Permission[]

  @OneToMany(() => User, user => user.role)
  users?: User[]
}
