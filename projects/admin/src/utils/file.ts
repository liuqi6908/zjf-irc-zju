/**
 * 判断文件类型
 * @param file
 * @param flag
 */
export function isFileType(file: File, flag: 'csv' | 'zip') {
  const { name, type } = file
  if (flag === 'csv') {
    const accept = ['text/csv', 'application/vnd.ms-excel']
    if (accept.includes(type) && name.split('.').pop() === 'csv')
      return true
  }
  else if (flag === 'zip') {
    const accept = ['application/x-zip-compressed']
    if (accept.includes(type) && name.split('.').pop() === 'zip')
      return true
  }
  return false
}
