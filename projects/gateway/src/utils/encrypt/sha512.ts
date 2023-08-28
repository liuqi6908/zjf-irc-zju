import * as crypto from 'node:crypto'

export function sha512(str: string) {
  const sha = crypto.createHash('sha512')
  sha.update(str, 'utf8')
  return sha.digest('hex')
}
