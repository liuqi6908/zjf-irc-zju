import { ICodeVerifyDto } from "../../dto/code-verify.interface";
import { IEmailDto } from "../../dto/email.interface";

export interface IUpdateEmailOwnBodyDto extends ICodeVerifyDto, IEmailDto {}