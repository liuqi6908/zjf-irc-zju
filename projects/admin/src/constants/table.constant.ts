import type { QTableProps } from 'quasar'

const rowsPerPageOptions = [10, 50, 100, 300, 500, 1000]

/** 用户表格字段 */
const userTableCols: QTableProps['columns'] = [
  { name: 'account', field: 'account', label: '用户', align: 'center' },
  { name: 'email', field: 'email', label: '邮箱', align: 'center' },
  { name: 'name', field: 'verification.name', label: '姓名', align: 'center' },
  { name: 'school', field: 'verification.school', label: '学校', align: 'center' },
  { name: 'college', field: 'verification.college', label: '学院', align: 'center' },
  { name: 'number', field: 'verification.number', label: '学号', align: 'center' },
  { name: 'idCard', field: 'verification.idCard', label: '身份证', align: 'center' },
  { name: 'identify', field: 'verification.identify', label: '身份', align: 'center' },
  { name: 'dataRoleName', field: 'dataRoleName', label: '角色', align: 'center' },
  { name: 'roleName', field: 'roleName', label: '权限', align: 'center' },
  { name: 'createdAt', field: 'createdAt', label: '注册时间', align: 'center' },
  { name: 'updatedAt', field: 'verification.updatedAt', label: '认证时间', align: 'center' },
  { name: 'status', field: 'verification.status', label: '状态', align: 'center' },
  { name: 'attachments', field: 'verification.attachments', label: '证明材料', align: 'center' },
  { name: 'action', field: 'action', label: '操作', align: 'center' },
]

/** 认证表格字段 */
const verifyTableCols: QTableProps['columns'] = [
  { name: 'account', field: 'founder.account', label: '用户', align: 'center' },
  { name: 'email', field: 'founder.email', label: '邮箱', align: 'center' },
  { name: 'name', field: 'name', label: '姓名', align: 'center' },
  { name: 'school', field: 'school', label: '学校', align: 'center' },
  { name: 'college', field: 'college', label: '学院', align: 'center' },
  { name: 'number', field: 'number', label: '学号', align: 'center' },
  { name: 'idCard', field: 'idCard', label: '身份证', align: 'center' },
  { name: 'identify', field: 'identify', label: '身份', align: 'center' },
  { name: 'dataRoleName', field: 'founder.dataRoleName', label: '角色', align: 'center' },
  { name: 'roleName', field: 'founder.roleName', label: '权限', align: 'center' },
  { name: 'founderCreatedAt', field: 'founder.createdAt', label: '注册时间', align: 'center' },
  { name: 'createdAt', field: 'createdAt', label: '申请时间', align: 'center' },
  { name: 'attachments', field: 'attachments', label: '证明材料', align: 'center' },
  { name: 'action', field: 'action', label: '操作', align: 'center' },
]

export {
  rowsPerPageOptions,
  userTableCols,
  verifyTableCols,
}
