import { ICodeActionDto, IEmailDto } from '../../dto';
import { IBasicResponse } from '../basic.interface';

export interface ISendEmailCodeBodyDto extends IEmailDto, ICodeActionDto {}

export interface ISendEmailCodeResData {
  /** 发送到邮箱的验证码的唯一标识 */
  bizId: string;
}

export interface ISendEmailCodeResDto extends IBasicResponse<ISendEmailCodeResData> {}