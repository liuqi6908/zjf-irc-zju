import { IsOptional, IsString } from 'class-validator'
import type { IUpsertDataRoleBodyDto } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpsertDataRoleBodyDto implements IUpsertDataRoleBodyDto {
  @ApiProperty({ description: '数据角色名称', example: '测试角色' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '数据角色描述', example: '测试角色的描述信息' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ description: '数据角色可查看的目录id列表 **需要传入全部的**' })
  @IsString({ each: true })
  viewableDirectoryIds?: string[]

  @ApiPropertyOptional({ description: '数据角色可下载的目录权限 **需要传入全部的**' })
  @IsString({ each: true })
  downloadableDirectoryIds?: string[]
}
