/**
 * 驼峰命名 转 横杠拼接
 * @param str
 * @return {string} 横杠拼接的字符串
 */
export function camel2Dash(
  /** 要转换的命名 */
  str: string
): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}
