
import { IEmailDto } from '../../dto/email.interface';
import { ICodeVerifyDto } from '../../dto/code-verify.interface';

export interface ILoginByEmailCodeBodyDto extends IEmailDto, ICodeVerifyDto {}