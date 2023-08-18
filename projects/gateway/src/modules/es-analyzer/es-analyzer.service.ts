import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from '@elastic/elasticsearch'
import type { ClientOptions } from '@elastic/elasticsearch'

@Injectable()
export class EsAnalyzerService {
  private _client: Client

  constructor(private readonly _cfgSrv: ConfigService) {}

  public getClient() {
    if (this._client)
      return this._client
    const client = new Client(this._cfgSrv.get<ClientOptions>('es.clientOpts'))
    this._client = client
    return client
  }
}
