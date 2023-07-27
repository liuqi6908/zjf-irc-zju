
/**
 * 从对象中取出指定的属性组成新的对象
 * @param obj 
 * @param keys 
 * @returns 
 */
export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {} as Pick<T, K>)
}