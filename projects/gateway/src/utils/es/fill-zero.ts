export function fillZero(num: number | string, len = 2) {
  return (Array(len).join('0') + num).slice(-len)
}
