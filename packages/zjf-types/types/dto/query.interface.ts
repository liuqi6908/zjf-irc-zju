import { IBasicResponse } from '../http/basic.interface';
import { IPaginatedResData, IPaginationDto } from './pagination.interface';

export type IQueryFilter<T> = {
  field: keyof T | string
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

export interface IQuerySort<T> {
  field: keyof T
  order: 'ASC' | 'DESC'
}

export interface IQueryConfig<Entity> {
   /** 分页信息 */
   pagination?: IPaginationDto

   /** 过滤条件 */
   filters?: IQueryFilter<Entity>[]
 
   /** 排序信息 */
   sort?: IQuerySort<Entity>[]
 
   /** 关联信息，传入字符串数组 */
   relations?: RelationSet<Entity>
}

export interface IQueryDto<Entity> extends IQueryConfig<Entity> {}

export type RelationSet<Entity, V = boolean> = {
  [K in keyof Entity]?: V | RelationSet<Entity[K], V>
}

/** 通用的分页查询结果 */
export interface IQueryResDto<Entity> extends IBasicResponse<IPaginatedResData<Entity>> {}