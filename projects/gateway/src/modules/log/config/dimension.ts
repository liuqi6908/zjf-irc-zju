export type LogDimension = {
  id: string
  name?: string
  field: string
  infoMapType?: string
  missing?: string
} & ({
  type: 'keyword'
} | {
  type: 'date'
  interval?: 'year' | 'quarter' | 'month' | 'day' | 'hour' | 'minute'
})

export const dimensions: LogDimension[] = [
  {
    id: 'D_YEAR',
    name: '按年统计',
    type: 'date',
    interval: 'year',
    field: 'time',
  },
  {
    id: 'D_QUARTER',
    name: '按季度统计',
    type: 'date',
    interval: 'quarter',
    field: 'time',
  },
  {
    id: 'D_MONTH',
    name: '按月统计',
    type: 'date',
    interval: 'month',
    field: 'time',
  },
  {
    id: 'D_DAY',
    name: '按日统计',
    type: 'date',
    interval: 'day',
    field: 'time',
  },
  {
    id: 'D_HOUR',
    name: '按小时统计',
    type: 'date',
    interval: 'hour',
    field: 'time',
  },
  {
    id: 'D_MINUTE',
    name: '按分钟统计',
    type: 'date',
    interval: 'minute',
    field: 'time',
  },
  {
    id: 'D_ACTION',
    name: '按操作统计',
    type: 'keyword',
    field: 'action',
  },
  {
    id: 'D_USER',
    name: '按用户统计',
    type: 'keyword',
    field: 'user.id',
    missing: '访客',
    infoMapType: 'user',
  },
  {
    id: 'D_IP',
    name: '按 IP 统计',
    type: 'keyword',
    field: 'ip',
  },
  {
    id: 'D_ROOT',
    name: '按数据大类统计',
    type: 'keyword',
    field: 'target.rootId',
    infoMapType: 'dataDirectory',
  },
  {
    id: 'D_DB',
    name: '按数据库统计',
    type: 'keyword',
    field: 'target.dbId',
    infoMapType: 'dataDirectory',
  },
  {
    id: 'D_SUB_DB',
    name: '按数据子库统计',
    type: 'keyword',
    field: 'target.subDbId',
    infoMapType: 'dataDirectory',
  },
  {
    id: 'D_MODULE',
    name: '按模块统计',
    type: 'keyword',
    field: 'target.moduleId',
    infoMapType: 'dataDirectory',
  },
  {
    id: 'D_TABLE',
    name: '按表统计',
    type: 'keyword',
    field: 'target.tableId',
    infoMapType: 'dataDirectory',
  },
]
