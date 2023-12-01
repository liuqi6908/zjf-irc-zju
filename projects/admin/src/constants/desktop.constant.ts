import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'
import type { QTableProps } from 'quasar'

/**
 * 云桌面申请状态
 */
const desktopStatus = [
  { label: '待审核', value: DesktopQueueStatus.Pending },
  { label: '排队中', value: DesktopQueueStatus.Queueing },
  { label: '使用中', value: DesktopQueueStatus.Using },
  { label: '已取消', value: DesktopQueueHistoryStatus.Canceled },
  { label: '已过期', value: DesktopQueueHistoryStatus.Expired },
  { label: '已拒绝', value: DesktopQueueHistoryStatus.Rejected },
]

/**
 * 云桌面申请表格字段
 */
const desktopRequestTableCols: QTableProps['columns'] = [
  { name: 'account', field: 'user.account', label: '用户' },
  { name: 'email', field: 'user.email', label: '邮箱' },
  { name: 'name', field: 'user.verification.name', label: '姓名' },
  { name: 'school', field: 'user.verification.school', label: '学校' },
  { name: 'college', field: 'user.verification.college', label: '学院' },
  { name: 'number', field: 'user.verification.number', label: '学号' },
  { name: 'idCard', field: 'user.verification.idCard', label: '身份证' },
  { name: 'dataRoleName', field: 'user.dataRoleName', label: '身份' },
  { name: 'roleName', field: 'user.roleName', label: '权限' },
  { name: 'createdAt', field: 'createdAt', label: '申请时间' },
  { name: 'duration', field: 'duration', label: '申请时长' },
  { name: 'attachments', field: 'attachments', label: '申请材料' },
  { name: 'status', field: 'status', label: '状态' },
  { name: 'action', field: 'action', label: '操作' },
].map(v => ({ ...v, align: 'center' }))

export {
  desktopStatus,
  desktopRequestTableCols,
}
