export function timestampFilename(filename: string) {
  const arr = filename.split('.')
  const ext = arr.pop()
  const name = arr.join('.')
  return `${name}-${Date.now()}.${ext}`
}
