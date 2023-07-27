import { randomInt } from "./random-int";

/**
 * 生成随机密码
 * @param min
 * @param max
 * @param special
 * @return {string} 随机密码
 */
export function getRandomPassword(
  /** 最小长度 */
  min = 8,
  /** 最大长度 */
  max = 16,
  /** 允许的特殊字符 */
  special = "!@#$%^&*()-_=+,.:;?/~"
) {
  const length = randomInt(min, max);
  const num = "0123456789";
  const chars = "abcdefghijklmnopqrstuvwxyz";

  const specialNum = special ? randomInt(1, 4) : 0;
  const upperCharNum = randomInt(1, (length - specialNum) / 2);
  const numNum = randomInt(1, (length - specialNum - upperCharNum) / 2);
  const rest = length - specialNum - upperCharNum - numNum;
  let password = "";
  const randomC = (dict: string) => dict[randomInt(0, dict.length - 1)];
  for (let i = 0; i < specialNum; i++) password += randomC(special);
  for (let i = 0; i < upperCharNum; i++)
    password += randomC(chars.toUpperCase());
  for (let i = 0; i < numNum; i++) password += randomC(num);
  for (let i = 0; i < rest; i++) password += randomC(chars);

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  return password;
}
