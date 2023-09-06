import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'

/** 云桌面申请状态 */
const desktopStatus = [
  { label: '待审核', value: DesktopQueueStatus.Pending },
  { label: '排队中', value: DesktopQueueStatus.Queueing },
  { label: '使用中', value: DesktopQueueStatus.Using },
  { label: '已取消', value: DesktopQueueHistoryStatus.Canceled },
  { label: '已过期', value: DesktopQueueHistoryStatus.Expired },
  { label: '已拒绝', value: DesktopQueueHistoryStatus.Rejected },
]

export {
  desktopStatus,
}
