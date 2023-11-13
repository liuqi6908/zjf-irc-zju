export interface IRegisterPlatformDto {
  /** 用户注册平台（0智能云科研、1区域发展政策大脑） */
  registerPlatform: 0 | 1
}

export interface IRegisterPlatformOptionalDto extends Partial<IRegisterPlatformDto> {}