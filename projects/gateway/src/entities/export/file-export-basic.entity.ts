import { ApiProperty } from '@nestjs/swagger'
import type { IFileExportBasic } from 'zjf-types'
import { Column, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '../user'
import { CreatedAt } from '../_timestamp'

export class FileExportBasic
  extends CreatedAt
  implements IFileExportBasic {
  @ApiProperty({ description: '外发记录的唯一标识' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '创建外发的 ip 地址' })
  @Column()
  ip: string

  @ApiProperty({ description: '创建外发的用户信息' })
  founder: User

  @ApiProperty({ description: '创建外发的用户' })
  @Column()
  founderId: string

  @ApiProperty({ description: '文件名称' })
  @Column()
  fileName: string

  @ApiProperty({ description: '文件大小，单位为字节' })
  @Column()
  fileSize: number

  @ApiProperty({ description: '备注信息' })
  @Column({ nullable: true })
  note?: string

  @ApiProperty({ description: '外发目标邮箱地址' })
  @Column()
  email?: string

  @ApiProperty({ description: '在 minio 中保存的完整路径' })
  @Column({ default: '' })
  path: string

  // // 非数据实体
  // desktop?: Desktop
}
