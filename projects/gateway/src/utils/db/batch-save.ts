import type { Repository } from 'typeorm'

export async function batchSave<T>(
  repo: Repository<T>,
  list: T[],
  idKey: keyof T,
  chunkSize = 50,
  restore = false,
) {
  const chunks = list.reduce((acc, cur) => {
    const lastChunk = acc[acc.length - 1]
    if (lastChunk.length < chunkSize)
      lastChunk.push(cur)
    else
      acc.push([cur])
    return acc
  }, [[]] as T[][])

  for (const chunk of chunks) {
    try {
      await repo.save(chunk.map((c) => {
        return restore
          ? { ...c, deletedAt: null }
          : c
      }))
    }
    catch (err) {
      restore && await repo.restore(chunk.map(c => c[idKey] as string))
    }
  }

  return list.length
}
