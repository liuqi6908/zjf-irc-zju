import { IEmailDto } from "../../dto/email.interface"
import { IAccountDto } from "../../dto/account.interface"
import { IPasswordDto } from "../../dto/password.interface"
import { ICodeVerifyDto } from '../../dto/code-verify.interface';


export interface IRegisterBodyDto 
  extends IAccountDto, IEmailDto, IPasswordDto, ICodeVerifyDto {}