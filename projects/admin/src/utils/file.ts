/**
 * csv 文件类型
 */
export const csvFileType = ['text/csv', 'application/vnd.ms-excel']

/**
 * zip 文件类型
 */
export const zipFileType = ['application/zip', 'application/x-zip-compressed']

/**
 * 判断文件类型
 * @param file
 * @param flag
 */
export function isFileType(file: File, flag: 'csv' | 'zip') {
  const { name, type } = file
  if (flag === 'csv') {
    if (csvFileType.includes(type) && name.split('.').pop() === 'csv')
      return true
  }
  else if (flag === 'zip') {
    if (zipFileType.includes(type) && name.split('.').pop() === 'zip')
      return true
  }
  return false
}
