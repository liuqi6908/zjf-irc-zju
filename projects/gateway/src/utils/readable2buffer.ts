import type { Readable } from 'node:stream'
import { Buffer } from 'node:buffer'

/**
 * 将 Readable 转换为 Buffer
 * @param readable
 * @returns
 */
export function readable2buffer(readable: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    readable.on('data', chunk => chunks.push(chunk))
    readable.on('end', () => resolve(Buffer.concat(chunks)))
    readable.on('error', reject)
  })
}
