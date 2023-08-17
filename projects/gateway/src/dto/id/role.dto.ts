import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { Role } from 'src/entities/role'
import type { IRoleNameDto, IRoleNameOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '角色名称' }),
    IsString(),
  ], optional)
}

export class RoleNameDto implements IRoleNameDto {
  @decorate(Decorator())
  roleName: Role['name']
}

export class RoleNameOptionalDto implements IRoleNameOptionalDto {
  @decorate(Decorator(true))
  roleName?: RoleNameDto['roleName']
}
