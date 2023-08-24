import type { Repository } from 'typeorm'
import { clamp, objectKeys } from '@catsjuice/utils'
import type { IQueryConfig } from 'zjf-types'
import { PAGINATION_SIZE_DFT, PAGINATION_SIZE_MAX } from 'zjf-types'
import type { PaginatedResData } from 'src/dto/pagination.dto'
import { responseParamsError } from './response/validate-exception-factory'

function walk(node: Record<string, any>, cb: (key: string, value: boolean, path: string[]) => void, path = []) {
  objectKeys(node).forEach((key) => {
    const value = node[key]
    cb(key, value, path)
    if (typeof value === 'object')
      walk(value, cb, [...path, key])
  })
}

export function getQueryQB<Entity>(
  repo: Repository<Entity>,
  config: IQueryConfig<Entity>,
) {
  const { pagination, filters, sort, relations } = config
  const qb = repo.createQueryBuilder('ent')
  let { page = 1, pageSize = PAGINATION_SIZE_DFT } = pagination || {}
  page = Math.max(page, 1)
  pageSize = clamp(pageSize, 1, PAGINATION_SIZE_MAX)

  // filters
  if (filters?.length) {
    filters.forEach((filter, index) => {
      const { type } = filter
      const field = String(filter.field)

      if (type === 'BETWEEN') {
        const [start, end] = filter.value
        qb.andWhere(`ent.${field} ${type} :start AND :end`, { start, end })
      }
      else if (type === 'LIKE' || type === 'NOT LIKE') {
        const value = `%${filter.value}%`
        qb.andWhere(`ent.${field} ${type} :${field}`, { [field]: value })
      }
      else if (type === 'IN' || type === 'NOT IN') {
        const value = filter.value
        qb.andWhere(`ent.${field} ${type} (:...${field})`, { [field]: value })
      }
      else if (type === 'IS NULL' || type === 'IS NOT NULL') {
        qb.andWhere(`ent.${field} ${type}`)
      }
      else if (
        type === '!='
        || type === '>'
        || type === '<'
        || type === '>='
        || type === '<='
        || type === '='
      ) {
        const value = (filter as any).value
        qb.andWhere(`ent.${field} ${type} :${field}`, { [field]: value })
      }
      else {
        const property = `filters[${index}].type`
        responseParamsError([{
          property,
          constraints: { [property]: `不支持的过滤类型：${type}` },
        }])
      }
    })
  }

  // sort
  if (sort?.length) {
    sort.forEach((sort, index) => {
      const { order } = sort
      const field = String(sort.field)

      if (field.includes(' ') || field.length > 64) {
        const property = `sort[${index}].field`
        responseParamsError([{
          property,
          constraints: { [property]: `字段名不合法：${field}` },
        }])
      }
      qb.addOrderBy(`ent.${String(field)}`, order)
    })
  }

  // relations
  if (relations && objectKeys(relations).length) {
    walk(relations, (key, value, path) => {
      const arr = [...path, key]
      const alias = arr.join('_')
      const parentAlias = arr.slice(0, -1).join('_')
      value && qb.leftJoinAndSelect(`${parentAlias}.${key}`, alias)
    }, ['ent'])
  }

  // paginate
  const skip = (page - 1) * pageSize
  qb.skip(skip).take(pageSize)

  return {
    qb,
    page,
    pageSize,
  }
}

/**
 * 通用的查询
 * @param config
 * @returns
 */
export async function getQuery<Entity>(
  repo: Repository<Entity>,
  config: IQueryConfig<Entity>,
): Promise<PaginatedResData<Entity>> {
  const { page, pageSize, qb } = getQueryQB(repo, config)
  const [data, total] = await qb.getManyAndCount()
  return {
    page,
    pageSize,
    total,
    data,
  }
}
