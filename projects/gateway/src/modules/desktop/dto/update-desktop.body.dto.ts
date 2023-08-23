import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'
import type { IUpdateDesktopInterface } from 'zjf-types'

export class UpdateDesktopBodyDto implements IUpdateDesktopInterface {
  @ApiPropertyOptional({ description: '内网地址' })
  @IsString()
  @IsOptional()
  internalIp?: string

  @ApiPropertyOptional({ description: '访问地址' })
  @IsString()
  @IsOptional()
  accessUrl?: string

  @ApiPropertyOptional({ description: '云桌面账号' })
  @IsString()
  @IsOptional()
  account?: string

  @ApiPropertyOptional({ description: '云桌面密码' })
  @IsString()
  @IsOptional()
  password?: string

  @ApiPropertyOptional({ description: '到期时间' })
  @IsDateString()
  @IsOptional()
  expiredAt?: Date
}
