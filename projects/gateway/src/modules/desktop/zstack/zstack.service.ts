import type { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { sha512 } from 'src/utils/encrypt/sha512'

@Injectable()
export class ZstackService {
  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _httpSrv: HttpService,
  ) {}

  private async _login() {
    const { host, user, password } = this._cfgSrv.get('zstack')

    const res = await this._httpSrv.axiosRef.put('/zstack/v1/accounts/login', {
      logInByAccount: {
        password: sha512(password),
        accountName: user,
      },
    }, { baseURL: host })

    const uuid = res.data?.inventory?.uuid

    if (!uuid)
      throw new Error('登录失败')

    return {
      uuid,
      config: {
        baseURL: host,
        headers: { Authorization: `OAuth ${uuid}` },
      },
    }
  }

  private _logout(uuid: string) {
    const url = `/zstack/v1/accounts/sessions/${uuid}`
    return this._httpSrv.axiosRef.delete(url)
  }

  public async requestWithSession<T = any>(
    request: (axiosCfg) => Promise<AxiosResponse<T>>,
  ) {
    return new Promise((resolve, reject) => {
      this._login().then(
        ({ uuid, config }) =>
          request(config)
            .then(response => resolve(response.data))
            .catch(reject)
            .finally(() => this._logout(uuid)),
      ).catch(reject)
    })
  }

  public zql(query: string) {
    const url = `/zstack/v1/zql?zql=${encodeURIComponent(query)}`
    return this.requestWithSession(axiosCfg =>
      this._httpSrv.axiosRef.get(url, axiosCfg),
    )
  }

  /**
   * 查询虚拟机状态
   * @param vmUUID
   */
  public getVMState(vmUUID: string) {
    const zqlStr = `query vminstance.state,uuid,hypervisorType,architecture,cpuNum,memorySize,platform,guestOsType,uuid,lastOpDate where uuid='${vmUUID}'`
    return this.zql(zqlStr)
  }
}
