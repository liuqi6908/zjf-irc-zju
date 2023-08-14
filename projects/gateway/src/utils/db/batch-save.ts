import type { Repository } from 'typeorm'

export async function batchSave<T>(repo: Repository<T>, list: T[], chunkSize = 50) {
  const chunks = list.reduce((acc, cur) => {
    const lastChunk = acc[acc.length - 1]
    if (lastChunk.length < chunkSize)
      lastChunk.push(cur)
    else
      acc.push([cur])
    return acc
  }, [[]] as T[][])

  for (const chunk of chunks)
    await repo.save(chunk)

  return list.length
}
