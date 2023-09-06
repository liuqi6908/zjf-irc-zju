import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import type { IDataField } from 'zjf-types'
import { DataDirectory } from './data-directory'

@Entity()
export class DataField implements IDataField {
  @ApiProperty({ description: '字段唯一标，生成方式为： `md5(rootId + table_en + field_en)`' })
  @PrimaryColumn()
  id: string

  @ApiProperty({ description: '字段中文' })
  @Column()
  nameZH: string

  @ApiProperty({ description: '字段英文' })
  @Column()
  nameEN: string

  @ApiProperty({ description: '字段说明' })
  @Column({ type: 'text' })
  description: string

  @ManyToOne(() => DataDirectory, directory => directory.fields, {
    onDelete: 'CASCADE',
  })
  directory?: DataDirectory

  @ApiProperty({ description: '所属的目录 id' })
  @Column()
  directoryId: string
}
