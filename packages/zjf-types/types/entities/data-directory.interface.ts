/** 数据目录 */
export interface IDataDirectory {
  /** 目录的唯一标识 */
  id: string;
  /** 中文名称 */
  nameZH: string;
  /** 英文名称 */
  nameEN: string;
  /** 父级目录的唯一标识 */
  parentId?: string;
  /** 排序 */
  order?: number;
  /** 引用规范信息 */
  reference?: string;


  //  ------- 以下信息为了方便数据处理而添加的字段  -------  //
  /** 根目录的唯一标识（方便快速删除指定的大类） */
  rootId?: string;
  /** 目录的层级 */
  level: number;
}