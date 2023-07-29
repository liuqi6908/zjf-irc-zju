export interface INicknameDto {
  /** 用户昵称 */
  nickname: string
}

export interface INicknameOptionalDto extends Partial<INicknameDto> {}