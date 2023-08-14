import { ApiProperty } from '@nestjs/swagger'
import type { IDataDirectory } from 'zjf-types'
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { DataField } from './data-field'

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

  @ManyToOne(() => DataDirectory, directory => directory.children, {
    // 不创建外键约束，以方便删除和创建
    // createForeignKeyConstraints: false,
  })
  parent?: DataDirectory

  @OneToMany(() => DataDirectory, directory => directory.parent)
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

  @OneToMany(() => DataField, field => field.directory, {
    onDelete: 'CASCADE',
  })
  fields?: DataField[]
}
