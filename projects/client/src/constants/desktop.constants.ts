/** 虚拟机状态 */
const vmStatusList = [
  { label: '开机中', value: 'Starting', flag: false },
  { label: '运行中', value: 'Running', flag: true },
  { label: '关机中', value: 'Stopping', flag: false },
  { label: '已关机', value: 'Stopped', flag: true },
  { label: '重启中', value: 'Rebooting', flag: false },
]

export {
  vmStatusList,
}
