export interface IRoleNameDto {
  /** 业务角色的唯一标识 */
  roleName: string
}

export interface IRoleNameOptionalDto extends Partial<IRoleNameDto> {}