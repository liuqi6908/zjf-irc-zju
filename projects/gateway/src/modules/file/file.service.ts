import * as Minio from 'minio'
import { ErrorCode } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { responseError } from 'src/utils/response'
import type { MinioConfig } from 'src/config/_minio.config'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'

@Injectable()
export class FileService {
  private readonly _cfg: MinioConfig

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

  public async download(bucket: keyof MinioConfig['bucket'], path: string) {
    const client = this.getClient()
    try {
      return await client.getObject(this._cfg.bucket[bucket], path)
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
    return await client.presignedGetObject(this._cfg.bucket[bucket], path, expires)
  }

  public async delete(bucket: keyof MinioConfig['bucket'], path: string) {
    const client = this.getClient()
    await client.removeObject(this._cfg.bucket[bucket], path)
  }
}
