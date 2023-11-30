import { ApiProperty } from '@nestjs/swagger'
import type { IDataRole } from 'zjf-types'
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'

import { User } from './user'
import { DataDirectory } from './data-directory'

@Entity()
export class DataRole implements IDataRole {
  @ApiProperty({ description: '数据下载角色的名称' })
  @PrimaryColumn()
  name: string

  @ApiProperty({ description: '数据下载角色的描述', required: false })
  @Column({ nullable: true })
  description?: string

  @ApiProperty({ description: '是否可选', required: false })
  @Column({ default: false })
  select?: boolean

  @ApiProperty({ description: '排序', required: false })
  @Column({ default: 0 })
  sort?: number

  @ApiProperty({ description: '数据下载角色的用户', required: false, type: () => [User] })
  @ManyToMany(() => User, user => user.dataRole)
  users?: User[]

  @ApiProperty({
    description: '数据下载角色-可浏览的数据目录',
    required: false,
    type: () => [DataDirectory],
  })
  @ManyToMany(() => DataDirectory, dataDirectory => dataDirectory.viewDataRoles, {
    // createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  viewDirectories?: DataDirectory[]

  @ApiProperty({
    description: '数据下载角色-可下载的数据目录',
    required: false,
    type: () => [DataDirectory],
  })
  @ManyToMany(() => DataDirectory, dataDirectory => dataDirectory.downloadDataRoles, {
    // createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  downloadDirectories?: DataDirectory[]
}
