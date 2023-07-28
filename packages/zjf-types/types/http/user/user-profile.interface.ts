import { IBasicResponse } from '../basic.interface';
import { IUser } from '../../entities/user.interface';

export interface IUserProfileResDto extends IBasicResponse<IUser> {}