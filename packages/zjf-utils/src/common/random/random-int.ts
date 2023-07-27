/**
 * 生成指定区间内的随机整数
 * @param start
 * @param end
 * @return {number} 随机整数
 */
export function randomInt(
  /** 最小值 */
  start = 0,
  /** 最大值 */
  end = 100
) {
  return Math.ceil(Math.random() * (end - start) + start);
}
