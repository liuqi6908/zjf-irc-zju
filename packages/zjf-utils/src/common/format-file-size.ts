/**
 * 文件尺寸单位
 */
export const fileSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

/**
 * 格式化文件尺寸
 * @param bytes
 * @returns
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const v = (bytes / Math.pow(k, i)).toFixed(2)
  return `${Number(v)} ${fileSizeUnits[i]}`
}