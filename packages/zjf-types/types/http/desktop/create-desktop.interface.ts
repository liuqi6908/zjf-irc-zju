import { IDesktop } from "../../entities/desktop.interface";

export interface ICreateDesktopBodyDto 
  extends Omit<
    IDesktop, 
    'user' | 'createdAt' | 'updatedAt' | 'userId' | 'lastUser' | 'lastUserId'
  >{}