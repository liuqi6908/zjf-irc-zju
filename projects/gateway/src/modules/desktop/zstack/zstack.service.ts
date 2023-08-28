import { EventEmitter } from 'node:stream'
import type { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { sha512 } from 'src/utils/encrypt/sha512'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class ZstackService extends EventEmitter {
  private _oauth = {
    token: '',
    expireAt: 0,
  }

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _httpSrv: HttpService,
  ) {
    super()
  }

  private async _login() {
    const { host, user, password } = this._cfgSrv.get('zstack')

    const getCfg = uuid => ({
      uuid,
      config: { baseURL: host, headers: { Authorization: `OAuth ${uuid}` } },
    })

    if (this._oauth.token && this._oauth.expireAt > Date.now())
      return getCfg(this._oauth.token)

    // 登出过期的 token
    if (this._oauth.token)
      this._logout(this._oauth.token)

    const res = await this._httpSrv.axiosRef({
      method: 'PUT',
      url: '/zstack/v1/accounts/login',
      data: {
        logInByAccount: {
          password: sha512(password),
          accountName: user,
        },
      },
      baseURL: host,
    })

    const uuid = res.data?.inventory?.uuid

    if (!uuid)
      throw new Error('登录失败')

    this._oauth = {
      token: uuid,
      expireAt: Date.now() + 1000 * 60 * 60 * 2,
    }

    return getCfg(uuid)
  }

  private _logout(uuid: string) {
    return this._httpSrv.axiosRef({
      method: 'DELETE',
      url: `/zstack/v1/accounts/sessions/${uuid}`,
    })
  }

  public requestWithSession<T = any>(
    request: (axiosCfg) => Promise<AxiosResponse<T>>,
  ) {
    return new Promise<T>((resolve, reject) => {
      this._login().then(
        ({ config }) =>
          request(config)
            .then(response => resolve(response.data))
            .catch(reject),
      ).catch(reject)
    })
  }

  public zql(query: string) {
    return this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'GET',
        url: `/zstack/v1/zql?zql=${encodeURIComponent(query)}`,
      })
    })
  }

  public getHostCpuMem(hostUuid: string) {
    // eslint-disable-next-line max-len
    const zqlStr = `query Host.name where uuid = '${hostUuid}' return with (zwatch{{resultName='CPUUsedCount',metricName='CPUUsedCapacityPerHostCount',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='CPUAvailableCount',metricName='CPUAvailableCapacityPerHostCount',offsetAheadOfCurrentTime=0}},zwatch{{resultName='CPUUsedPercent',metricName='CPUUsedCapacityPerHostInPercent',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memUsed', metricName='MemoryUsedCapacityPerHostInBytes',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memAvailable', metricName='MemoryAvailableCapacityPerHostInBytes',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memUsedPercent', metricName='MemoryUsedCapacityPerHostInPercent',offsetAheadOfCurrentTime=0}})`
    return this.zql(zqlStr)
  }

  /**
   * 获取全部物理机器的 CPU、内存分配
   * @returns
   */
  public async getAllHostCpuMem() {
    const hosts = await this.getHostList()
    const uuids = hosts.results.flatMap(host => host?.inventories?.map(el => el.uuid))
    const promises = uuids.map(uuid => this.getHostCpuMem(uuid))
    const res = await Promise.all(promises)
    return res.flatMap(el => el.results).map(el => ({
      host: el.inventories[0].name,
      info: el.returnWith,
    }))
  }

  /**
   * 获取物理主机列表
   * @returns
   */
  public getHostList() {
    const zqlStr = 'query Host.uuid,name'
    return this.zql(zqlStr)
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
