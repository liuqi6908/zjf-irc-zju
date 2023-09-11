import {IUser} from 'zjf-types';

export function getUsername(user?: IUser) {
  const verification = user?.verification;
  const nameInVerification = verification?.name;
  if (nameInVerification) 
    return nameInVerification;

  return user?.nickname || user?.account || user?.email
}