import { ApiProperty } from '@nestjs/swagger'
import type { ICreateDesktopBodyDto } from 'zjf-types'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class CreateDesktopBodyDto implements ICreateDesktopBodyDto {
  @ApiProperty({ description: '云桌面 id' })
  @IsString()
  id: string

  @ApiProperty({ description: '云桌面名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '内网地址' })
  @IsString()
  internalIp: string

  @ApiProperty({ description: '访问地址' })
  @IsString()
  accessUrl: string

  @ApiProperty({ description: '云桌面账号' })
  @IsString()
  account: string

  @ApiProperty({ description: '云桌面密码' })
  @IsString()
  password: string

  @ApiProperty({ description: '到期时间', required: false })
  @IsDateString()
  @IsOptional()
  expiredAt: Date
}
