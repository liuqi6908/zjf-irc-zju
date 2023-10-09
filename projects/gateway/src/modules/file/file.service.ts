import type internal from 'node:stream'
import * as Minio from 'minio'
import { ErrorCode } from 'zjf-types'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { responseError } from 'src/utils/response'
import type { MinioConfig } from 'src/config/_minio.config'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { randomString } from '@catsjuice/utils'

@Injectable()
export class FileService {
  private readonly _logger: Logger = new Logger(FileService.name)
  private readonly _cfg: MinioConfig

  private readonly _lockCache = new Map<string, {
    promise: Promise<internal.Readable>
    process: Record<string, boolean>
  }>()

  constructor(private readonly _cfgSrv: ConfigService) {
    this._cfg = this._cfgSrv.get<MinioConfig>('minio')
  }

  public getClient(internal = true) {
    const { endpoint, port, ak, sk, useSSL } = this._cfg!
    return new Minio.Client({
      endPoint: internal ? endpoint.internal : endpoint.external,
      port,
      useSSL,
      accessKey: ak,
      secretKey: sk,
    })
  }

  public async upload(bucket: keyof MinioConfig['bucket'], path: string, file: any) {
    if (!path) {
      responseParamsError([{
        property: 'path',
        constraints: {
          path: 'path is required',
        },
      }])
    }

    if (!file) {
      responseParamsError([{
        property: 'file',
        constraints: {
          file: 'file is required',
        },
      }])
    }

    const client = this.getClient()
    const metaData = { 'Content-Type': 'application/octet-stream' }
    await client.putObject(this._cfg.bucket[bucket], path, file, metaData)
  }

  public async stat(bucket: keyof MinioConfig['bucket'], path: string) {
    const client = this.getClient()
    try {
      return await client.statObject(this._cfg.bucket[bucket], path)
    }
    catch (err) {
      if (err.message.match(/Not Found/))
        responseError(ErrorCode.FILE_NOT_FOUND)
      else
        responseError(ErrorCode.COMMON_UNEXPECTED_ERROR, err.message)
    }
  }

  private async _download(bucket: keyof MinioConfig['bucket'], path: string, range?: { start: number; end: number }) {
    const client = this.getClient()

    if (range)
      return await client.getPartialObject(this._cfg.bucket[bucket], path, range.start, range.end - range.start + 1)
    else
      return await client.getObject(this._cfg.bucket[bucket], path)
  }

  public async download(
    bucket: keyof MinioConfig['bucket'],
    path: string,
    range?: { start: number; end: number },
  ) {
    const id = randomString(8, 12)
    const rangeKey = range ? `${range.start}-${range.end}` : 'none'
    const key = `${bucket}:${path}:${rangeKey}`
    if (!this._lockCache.has(key)) {
      const process = {}
      const promise = this._download(bucket, path, range)
      this._lockCache.set(key, { promise, process })
    }
    const { promise, process } = this._lockCache.get(key)!
    process[id] = true

    try {
      return await new Promise<internal.Readable>((resolve, reject) => {
        promise
          .then(resolve)
          .catch(reject)
          .finally(() => {
            delete process[id]
            if (Object.keys(process).length === 0)
              this._lockCache.delete(key)
            else this._logger.debug(`[${id}] download process for [${key}] left: ${Object.keys(process).length} remaining`)
          })
      })
    }
    catch (err) {
      if (err.message.match(/The specified key does not exist/))
        responseError(ErrorCode.FILE_NOT_FOUND)
    }
  }

  public async signUrl(bucket: keyof MinioConfig['bucket'], path: string, expires = 60 * 10) {
    // 如果是下载数据，仅允许签发内网链接
    const client = this.getClient(bucket === 'data')

    // 检查文件是否存在
    try {
      await client.statObject(this._cfg.bucket[bucket], path)
    }
    catch (err) {
      if (err.message.match(/Not Found/))
        responseError(ErrorCode.FILE_NOT_FOUND)
    }

    // 签发链接
    const filename = path.split('/').pop()
    const ext = filename.split('.').pop()
    return await client.presignedGetObject(this._cfg.bucket[bucket], path, expires, {
      'Content-Type': `application/${ext}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
    })
  }

  public async delete(bucket: keyof MinioConfig['bucket'], path: string) {
    const client = this.getClient()
    await client.removeObject(this._cfg.bucket[bucket], path)
  }
}
