import { IConfigDto } from '../../dto/config.interface'

export interface IUpsertConfigBodyDto extends IConfigDto {
  /** 配置版本 */
  version: string;
}