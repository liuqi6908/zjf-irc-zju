export interface IVerificationIdDto {
  /** 认证记录的唯一标识 */
  verificationId: string
}

export interface IVerificationIdOptionalDto extends Partial<IVerificationIdDto> {}