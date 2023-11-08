export interface IRegisterPlatformDto {
  /** 用户注册平台（0云科研、1城市大脑） */
  registerPlatform: 0 | 1
}

export interface IRegisterPlatformOptionalDto extends Partial<IRegisterPlatformDto> {}