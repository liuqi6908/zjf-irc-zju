import { IsNumber, IsString } from 'class-validator'
import type { IUpsertConfigBodyDto } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'

export class UpsertConfigBodyDto implements IUpsertConfigBodyDto {
  @ApiProperty({ description: '配置版本', example: 'file' })
  @IsString()
  version: string

  @ApiProperty({ description: '小文件尺寸限制，单位为 字节', example: 102400 })
  @IsNumber()
  sizeLimitSm: number

  @ApiProperty({ description: '大文件尺寸限制，单位为 字节', example: 5242880 })
  @IsNumber()
  sizeLimitLg: number

  @ApiProperty({ description: '小文件每日外发限制', example: 5 })
  @IsNumber()
  dailyLimit: number
}
