import { IBasicResponse } from '../basic.interface';
import { IVerificationHistory } from '../../entities/verification.interface';

export interface ICreateVerificationBodyDto
  extends Pick<IVerificationHistory,
    | 'name'
    | 'identify'
    | 'attachments'
    | 'school'
    | 'college'
    | 'number'
    | 'idCard'
  > {}

export interface IVerificationResDto
  extends IBasicResponse<IVerificationHistory> {}