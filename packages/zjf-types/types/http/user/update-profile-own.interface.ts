import { IUser } from '../../entities/user.interface';

export interface IUpdateProfileOwnBodyDto extends Pick<IUser, 'nickname'> {}