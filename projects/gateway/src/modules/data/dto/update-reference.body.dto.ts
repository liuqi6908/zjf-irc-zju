import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateReferenceBodyDto {
  @ApiProperty({ description: '引用规范（无 interface 定义）' })
  @IsString()
  @IsNotEmpty()
  reference: string
}
