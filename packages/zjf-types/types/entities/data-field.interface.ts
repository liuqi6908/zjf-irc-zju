/** 数据字段说明 */
export interface IDataField {
  /** 字段唯一标，生成方式为： `md5(table_en + field_en)` */
  id: string;
  /** 字段中文 */
  nameZH: string; 
  /** 字段英文 */
  nameEN: string;
  /** 字段说明 */
  description: string;
  /** 所属的目录 id */
  directoryId: string;
}