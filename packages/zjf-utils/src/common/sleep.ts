/**
 * 使用 Promise 封装 setTimeout，使其支持 async/await
 * @param time
 */
export function sleep(
  /** 时长，单位为 ms */
  time: number
) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
