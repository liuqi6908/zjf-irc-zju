export interface ICmsIdDto {
  /** 内容的唯一标识（不得包含特殊字符） */
  cmsId: string
}

export interface ICmsIdOptionalDto extends Partial<ICmsIdDto> {}