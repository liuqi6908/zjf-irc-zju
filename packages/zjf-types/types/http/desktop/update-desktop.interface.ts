import { ICreateDesktopBodyDto } from "./create-desktop.interface";

export interface IUpdateDesktopInterface
extends Partial<Omit<ICreateDesktopBodyDto, 'id'>> {}