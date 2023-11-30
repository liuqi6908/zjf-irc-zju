import type { QTableProps } from 'quasar'

const rowsPerPageOptions = [50, 100, 300, 500, 1000]
function tablePagination() {
  return ref({
    page: 1,
    rowsPerPage: 50,
    rowsNumber: 0,
  })
}

/** 用户表格字段 */
const userTableCols: QTableProps['columns'] = [
  { name: 'account', field: 'account', label: '用户' },
  { name: 'email', field: 'email', label: '邮箱' },
  { name: 'name', field: 'verification.name', label: '姓名' },
  { name: 'school', field: 'verification.school', label: '学校' },
  { name: 'college', field: 'verification.college', label: '学院' },
  { name: 'number', field: 'verification.number', label: '学号' },
  { name: 'idCard', field: 'verification.idCard', label: '身份证' },
  { name: 'dataRoleName', field: 'dataRoleName', label: '身份' },
  { name: 'roleName', field: 'roleName', label: '权限' },
  { name: 'createdAt', field: 'createdAt', label: '注册时间' },
  { name: 'updatedAt', field: 'verification.updatedAt', label: '认证时间' },
  { name: 'status', field: 'verification.status', label: '状态' },
  { name: 'attachments', field: 'verification.attachments', label: '证明材料' },
  { name: 'action', field: 'action', label: '操作' },
].map(v => ({ ...v, align: 'center' }))

/** 认证表格字段 */
const verifyTableCols: QTableProps['columns'] = [
  { name: 'account', field: 'founder.account', label: '用户' },
  { name: 'email', field: 'founder.email', label: '邮箱' },
  { name: 'name', field: 'name', label: '姓名' },
  { name: 'school', field: 'school', label: '学校' },
  { name: 'college', field: 'college', label: '学院' },
  { name: 'number', field: 'number', label: '学号' },
  { name: 'idCard', field: 'idCard', label: '身份证' },
  { name: 'identify', field: 'identify', label: '身份' },
  { name: 'roleName', field: 'founder.roleName', label: '权限' },
  { name: 'founderCreatedAt', field: 'founder.createdAt', label: '注册时间' },
  { name: 'createdAt', field: 'createdAt', label: '申请时间' },
  { name: 'attachments', field: 'attachments', label: '证明材料' },
  { name: 'action', field: 'action', label: '操作' },
].map(v => ({ ...v, align: 'center' }))

export {
  rowsPerPageOptions,
  tablePagination,
  userTableCols,
  verifyTableCols,
}
