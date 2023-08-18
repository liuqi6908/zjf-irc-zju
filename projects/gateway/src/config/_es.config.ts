import { registerAs } from '@nestjs/config'
import type { ClientOptions } from '@elastic/elasticsearch'

export interface ESConfig {
  clientOpts: ClientOptions
  index?: Record<ESIndex, string>
}

export type ESIndex = 'log' | 'not_exists'

export default registerAs('es', () => {
  const username = process.env.ES_USERNAME
  const password = process.env.ES_PASSWORD

  const clientOpts: ClientOptions = { node: process.env.ES_HOST }
  if (username || password)
    clientOpts.auth = { username, password }

  return {
    clientOpts,
    index: {
      log: process.env.ES_INDEX_LOG,
      not_exists: process.env.ES_INDEX_NOT_EXISTS,
    },
  } satisfies ESConfig
})
