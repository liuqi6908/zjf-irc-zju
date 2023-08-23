import { ISysConfig } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class ConfigResDto extends SuccessDto {
  @ApiProperty({
    description: sharedVariableMarkdown('ISysConfig', 'zjf-types', '配置对象类型定义'),
  })
  data: ISysConfig
}
