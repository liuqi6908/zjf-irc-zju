import { IVerificationHistory } from '../../entities/verification.interface';
import { IBasicResponse } from '../basic.interface';

export interface ICreateVerificationBodyDto 
  extends Pick<IVerificationHistory, 'name' | 'identify' | 'attachments'> {}

export interface ICreateVerificationResDto
  extends IBasicResponse<IVerificationHistory> {}