import { IEmailDto } from "../../dto/email.interface";
import { IPasswordDto } from "../../dto/password.interface";
import { IRegisterPlatformDto } from "../../dto/register-platform.interface";
import { ICodeVerifyDto } from "../../dto/code-verify.interface";

export interface IUpdatePasswordByCodeBodyDto extends IPasswordDto, IEmailDto, ICodeVerifyDto, IRegisterPlatformDto {}