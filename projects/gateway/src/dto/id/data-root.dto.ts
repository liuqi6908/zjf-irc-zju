import { IsEnum } from 'class-validator'
import { enumMarkdown } from 'zjf-utils'
import { ApiProperty } from '@nestjs/swagger'
import { DataRoot, dataRootDescriptions } from 'zjf-types'
import type { IDataRootIdDto, IDataRootIdOptionalDto } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: `数据大类的唯一标识\n${
      enumMarkdown(dataRootDescriptions)}\n${
        sharedVariableMarkdown('DataRoot', 'zjf-types', '枚举值')}`,
      enum: DataRoot,
    }),
    IsEnum(DataRoot),
  ], optional)
}

export class DataRootIdDto implements IDataRootIdDto {
  @Decorator()
  dataRootId: string
}

export class DataRootIdOptionalDto implements IDataRootIdOptionalDto {
  @Decorator(true)
  dataRootId?: string
}
