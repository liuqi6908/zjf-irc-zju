
import { ICodeVerifyDto } from '../../dto/code-verify.interface';
import { IEmailDto } from '../../dto/email.interface';

export interface IUnbindEmailOwnBodyDto extends ICodeVerifyDto, IEmailDto {}