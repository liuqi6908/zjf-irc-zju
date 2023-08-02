import { IUser } from '../../entities/user.interface';
import { IPasswordDto } from '../../dto/password.interface';
import { IPhoneOptionalDto } from '../../dto/phone.interface';
import { IEmailOptionalDto } from '../../dto/email.interface';
import { INicknameOptionalDto } from '../../dto/nickname.interface';

export interface ICreateUserBodyDto
  extends
  INicknameOptionalDto,
  IPasswordDto,
  IPhoneOptionalDto,
  IEmailOptionalDto
{}

export interface ICreateUserResDto extends IUser {}