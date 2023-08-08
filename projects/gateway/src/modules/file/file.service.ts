import * as Minio from 'minio'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
    return await client.getObject(this._cfg.bucket[bucket], path)
  }
}
