import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { DataRole } from 'src/entities/data-role'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '角色名称' }),
    IsString(),
  ], optional)
}

export class DataRoleNameDto {
  @decorate(Decorator())
  dataRoleName: DataRole['name']
}

export class RoleNameOptionalDto {
  @decorate(Decorator(true))
  dataRoleName?: DataRoleNameDto['dataRoleName']
}
