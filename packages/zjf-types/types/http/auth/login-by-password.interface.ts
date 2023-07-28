import { IBasicResponse } from '../basic.interface';
import { IUser } from '../../entities/user.interface';
import { IPasswordDto } from '../../dto/password.interface';
import { IPhoneOptionalDto } from '../../dto/phone.interface';
import { IEmailOptionalDto } from '../../dto/email.interface';

export interface ILoginByPasswordBodyDto 
  extends 
  IPasswordDto,
  IPhoneOptionalDto,
  IEmailOptionalDto {}

/** 登录成功的响应类型定义 */
export interface ILoginSuccessResData {

  /** 登录凭证信息 */
  sign: {
    /** JWT 登录凭证 */
    access_token: string

    /** 过期时间戳 */
    expireAt: number
  }

  /** 用户信息 */
  user: IUser
}

/** 登录成功的请求响应类型定义 */
export interface ILoginSuccessResDto extends IBasicResponse<ILoginSuccessResData> {}