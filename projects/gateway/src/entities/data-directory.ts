import { ApiProperty } from '@nestjs/swagger'
import type { IDataDirectory } from 'zjf-types'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { DataRole } from './data-role'
import { DataField } from './data-field'
import { DataSuggestion } from './data-suggestion'

@Entity()
export class DataDirectory implements IDataDirectory {
  @ApiProperty({ description: '目录的唯一标识' })
  @PrimaryColumn()
  id: string

  /** 名称 */
  @ApiProperty({ description: '中文名称' })
  @Column()
  nameZH: string

  @ApiProperty({ description: '英文名称' })
  @Column()
  nameEN: string

  @ApiProperty({ description: '父目录', type: () => DataDirectory })
  @ManyToOne(() => DataDirectory, directory => directory.children, {
    // 不创建外键约束，以方便删除和创建
    // createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  parent?: DataDirectory

  @ApiProperty({ type: () => [DataDirectory], description: '子目录' })
  @OneToMany(() => DataDirectory, directory => directory.parent, {
    onDelete: 'CASCADE',
  })
  children?: DataDirectory[]

  @ApiProperty({ description: '所属的目录 id' })
  @Column({ nullable: true })
  parentId?: string

  @ApiProperty({ description: '根目录的唯一标识（方便快速删除指定的大类）' })
  @Column()
  rootId?: string

  @ApiProperty({ description: '目录的层级' })
  @Column()
  level: number

  @ApiProperty({ description: '排序' })
  @Column()
  order?: number

  @ApiProperty({ description: '引用规范' })
  @Column({ nullable: true })
  reference?: string

  @OneToMany(() => DataField, field => field.directory, {
    onDelete: 'CASCADE',
  })
  fields?: DataField[]

  @ApiProperty({ description: '拥有查看权限的数据角色列表' })
  @ManyToMany(() => DataRole, role => role.viewDirectories, {
    // createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  viewDataRoles?: DataRole[]

  @ApiProperty({ description: '拥有下载权限的数据角色列表' })
  @ManyToMany(() => DataRole, role => role.downloadDirectories, {
    // createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  downloadDataRoles?: DataRole[]

  @Column({ type: 'simple-array', nullable: true })
  path?: string[]

  @ApiProperty({ description: '用户发起的建议' })
  @OneToMany(() => DataSuggestion, sug => sug.dataDirectory, {
    onDelete: 'CASCADE',
  })
  suggestions?: DataSuggestion[]
}
