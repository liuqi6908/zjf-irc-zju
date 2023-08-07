import { IPasswordDto } from "../../dto/password.interface";

export interface IUpdatePasswordByOldBodyDto {
  oldPassword: IPasswordDto['password']
  newPassword: IPasswordDto['password']
}