/**
 * 展开json对象
 * @param json
 * @returns
 */
export function flattenJSON(json: any): Record<string, any> {
  let result: Record<string, any> = {}

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeof json[key] === 'object' && !Array.isArray(json[key])) {
        const nestedJson = flattenJSON(json[key])
        result = { ...result, ...nestedJson }
      }
      else {
        result[key] = json[key]
      }
    }
  }

  return result
}
