import { IBasicResponse } from '../http/basic.interface';
import { IPaginatedResData, IPaginationDto } from './pagination.interface';

export type IQueryFilter = {
  field: string
} & (
  {
    type: '=' | '!=' | '>' | '<' | '>=' | '<='
    value: any
  } | {
    type: 'BETWEEN'
    value: [any, any]
  } | {
    type: 'IS NULL' | 'IS NOT NULL'
  } | {
    type: 'IN' | 'NOT IN'
    value: any[]
  } | {
    type: 'LIKE' | 'NOT LIKE'
    value: string
  }
)

export interface IQuerySort {
  field: string
  order: 'ASC' | 'DESC'
}

export interface IQueryConfig<Entity> {
   /** 分页信息 */
   pagination?: IPaginationDto

   /** 过滤条件 */
   filters?: IQueryFilter[]
 
   /** 排序信息 */
   sort?: IQuerySort[]
 
   /** 关联信息，传入字符串数组 */
   relations?: RelationSet<Entity>
}

export interface IQueryDto<Entity> extends IQueryConfig<Entity> {}

export type RelationSet<Entity> = {
  [K in keyof Entity]?: boolean | RelationSet<Entity[K]>
}

/** 通用的分页查询结果 */
export interface IQueryResDto<Entity> extends IBasicResponse<IPaginatedResData<Entity>> {}