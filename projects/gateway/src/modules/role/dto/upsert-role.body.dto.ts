import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import type { IUpsertRoleBodyDto } from 'zjf-types'
import { PermissionType } from 'zjf-types'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpsertRoleBodyDto implements IUpsertRoleBodyDto {
  @ApiProperty({ description: '角色名称', example: '测试角色' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '角色描述', example: '测试角色的描述信息' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: '权限列表',
    example: [PermissionType.ACCOUNT_CREATE],
  })
  @IsArray()
  @IsEnum(
    PermissionType,
    {
      each: true,
      message: 'permissions 中的每个值必须是 PermissionType 枚举值',
    },
  )
  @Type(() => String)
  @IsOptional()
  permissions?: PermissionType[]
}
