import { IEmailDto } from '../../dto/email.interface';

export interface ILoginByEmailLinkDto extends IEmailDto {
  /** 重定向的地址 */
  redirect: string;

  /**
   * token 存储的参数名称
   * @default 'token'
   */
  queryName?: string;
}