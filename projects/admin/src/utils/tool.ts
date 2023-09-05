/**
 * 展开json对象
 * @param json
 * @returns
 */
export function flattenJSON(json: any, prefix = '', result?: Record<string, any>): Record<string, any> {
  if (!result)
    result = {}
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && !Array.isArray(value))
        flattenJSON(value, newKey, result)
      else
        result[newKey] = value
    }
  }
  return result
}

/**
 * 根据二进制文件流下载文件
 * @param stream
 * @param filename
 */
export function downloadFile(stream: string, filename: string) {
  const blob = new Blob([stream], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // 清理创建的对象 URL
  URL.revokeObjectURL(url)
}
