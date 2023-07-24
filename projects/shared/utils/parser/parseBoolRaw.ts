/**
 * 将 boolean 的字符串描述转换为 boolean 值，如果无法转换则返回 undefined
 * 
 * - true 值的描述：`true`, `yes`, `1`, `TRUE`, `YES`, `True`, `Yes`
 * - false 值的描述：`false`, `no`, `0`, `FALSE`, `NO`, `False`, `No`
 * @param src
 * @return {boolean | undefined} 返回转换后的 boolean 值
 */
export function parseBoolRaw(
  /** 要转换的值 */
  src: string
) {
  const truly = ["true", "yes", "1", "TRUE", "YES", "True", "Yes"];
  const falsy = ["false", "no", "0", "FALSE", "NO", "False", "No"];
  return truly.includes(src) ? true : falsy.includes(src) ? false : undefined;
}
