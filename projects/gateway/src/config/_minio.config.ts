import { registerAs } from '@nestjs/config'
import { parseBoolRaw } from 'zjf-utils'

export interface MinioConfig {
  endpoint: {
    internal: string
    external: string
  }
  port: number
  ak: string
  sk: string
  useSSL?: boolean
  bucket: {
    pub: string
    pri: string
    data: string
  }
}

export default registerAs('minio', (): MinioConfig => {
  // 强制要求必须的环境变量
  if (!process.env.MINIO_ENDPOINT_INTERNAL)
    throw new Error('MINIO_ENDPOINT_INTERNAL is missing')
  if (!process.env.MINIO_ENDPOINT_EXTERNAL)
    throw new Error('MINIO_ENDPOINT_EXTERNAL is missing')
  if (!process.env.MINIO_PORT)
    throw new Error('MINIO_PORT is missing')
  if (!process.env.MINIO_AK)
    throw new Error('MINIO_AK is missing')
  if (!process.env.MINIO_SK)
    throw new Error('MINIO_SK is missing')
  if (!process.env.MINIO_BUCKET_PUBLIC)
    throw new Error('MINIO_BUCKET_PUBLIC is missing')
  if (!process.env.MINIO_BUCKET_PRIVATE)
    throw new Error('MINIO_BUCKET_PRIVATE is missing')
  if (!process.env.MINIO_BUCKET_DATA)
    throw new Error('MINIO_BUCKET_DATA is missing')

  return {
    endpoint: {
      internal: process.env.MINIO_ENDPOINT_INTERNAL,
      external: process.env.MINIO_ENDPOINT_EXTERNAL,
    },
    port: Number(process.env.MINIO_PORT),
    ak: process.env.MINIO_AK,
    sk: process.env.MINIO_SK,
    useSSL: parseBoolRaw(process.env.MINIO_USE_SSL),
    bucket: {
      pub: process.env.MINIO_BUCKET_PUBLIC,
      pri: process.env.MINIO_BUCKET_PRIVATE,
      data: process.env.MINIO_BUCKET_DATA,
    },
  }
})
