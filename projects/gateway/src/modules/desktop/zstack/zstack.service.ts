import { EventEmitter } from 'node:stream'
import type { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { sha512 } from 'src/utils/encrypt/sha512'

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

  public async getHostCpuMem(hostUuid: string) {
    // eslint-disable-next-line max-len
    const zqlStr1 = `query Host.name where uuid = '${hostUuid}' return with (zwatch{{resultName='CPUUsedCount',metricName='CPUUsedCapacityPerHostCount',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='CPUAvailableCount',metricName='CPUAvailableCapacityPerHostCount',offsetAheadOfCurrentTime=0}},zwatch{{resultName='CPUUsedPercent',metricName='CPUUsedCapacityPerHostInPercent',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memUsed', metricName='MemoryUsedCapacityPerHostInBytes',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memAvailable', metricName='MemoryAvailableCapacityPerHostInBytes',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='memUsedPercent', metricName='MemoryUsedCapacityPerHostInPercent',offsetAheadOfCurrentTime=0}})`
    // eslint-disable-next-line max-len
    const zqlStr2 = `query Host.name where uuid = '${hostUuid}' return with (zwatch{{resultName='diskTotal', metricName='DiskTotalCapacityInBytes',offsetAheadOfCurrentTime=0}},zwatch{{resultName='diskUsed',metricName='DiskAllUsedCapacityInBytes',offsetAheadOfCurrentTime=0}}, zwatch{{resultName='diskUsedPercent',metricName='DiskAllUsedCapacityInPercent',offsetAheadOfCurrentTime=0}})`
    const [res1, res2] = await Promise.all([this.zql(zqlStr1), this.zql(zqlStr2)])
    return {
      ...res1.results[0].returnWith,
      ...res2.results[0].returnWith,
    }
  }

  public async getHostMonitor(hostUuid: string, period = 60) {
    // eslint-disable-next-line max-len
    const zql = `query Host.name where uuid = '${hostUuid}' return with (zwatch{{resultName='CPUUtilization', metricName='CPUAllUsedUtilization',offsetAheadOfCurrentTime=3600, period=${period}}},zwatch{{resultName='memUsed',metricName='MemoryUsedInPercent',offsetAheadOfCurrentTime=3600, period=${period}}}, zwatch{{resultName='diskRead',metricName='DiskAllReadBytes', offsetAheadOfCurrentTime=3600, period=${period}}}, zwatch{{resultName='diskWrite',metricName='DiskAllWriteBytes', offsetAheadOfCurrentTime=3600, period=${period}}})`
    const res = await this.zql(zql)
    return res.results[0].returnWith
  }

  /**
   * 获取全部物理机器的 CPU、内存分配
   * @returns
   */
  public async getAllHostCpuMem() {
    const hosts = await this.getHostList()
    const uuids = hosts.map(host => host?.inventories?.map(el => el.uuid))
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
  public async getHostList() {
    const zqlStr = 'query Host.uuid,name'
    const res = await this.zql(zqlStr)
    return res.results?.flatMap(el => el.inventories)
  }

  /**
   * 获取集群存储使用情况
   */
  public async getClusterStorage() {
    // eslint-disable-next-line max-len
    const zqlStr = 'query PrimaryStorage.uuid return with(zwatch{{resultName=\'UsedCapacityInPercent\', metricName=\'UsedCapacityInPercent\', offsetAheadOfCurrentTime=0}}, zwatch{{resultName=\'UsedCapacityInBytes\', metricName=\'UsedCapacityInBytes\', offsetAheadOfCurrentTime=0}}, zwatch{{resultName=\'TotalCapacityInBytes\', metricName=\'TotalPhysicalCapacityInBytes\', offsetAheadOfCurrentTime=0}})'
    const res = await this.zql(zqlStr)
    return res.results[0].returnWith
  }

  /**
   * 获取云桌面虚拟机列表
   */
  public async vmList() {
    const res = await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'GET',
        url: '/zstack/v1/vm-instances',
      })
    })
    const ban_names = [
      'Windows-Server2016', 'Server2016TMP', 'YUNOPR01', 'YUNOPR02', 'YUNODC01', 'YUNODC02',
      'YUNODB03', 'YUNODB02', 'YUNODB01', 'YUNOLIC', 'YUNOAD02', 'YUNOAD01', 'mysql8',
      'mysql8bak', 'minio-1', 'minio-2', 'minio-3', 'minio-4', 'docker', 'TEST-1', 'TEST-2',
      'TEST-3', 'elasticsearch-1', 'elasticsearch-2', 'elasticsearch-3', '安全接入选件',
      'yuancheng', 'Win10', 'Win10TMP', 'Yunzy', 'zstackapi',
    ]
    const { inventories = [] } = res
    return inventories.filter((v: any) => {
      const { name, vmNics } = v
      return !ban_names.includes(name) && vmNics?.length
    })
      .map((v: any) => {
        const { uuid, name, vmNics } = v
        return {
          uuid,
          name,
          ip: vmNics[0].ip,
        }
      })
  }

  public async startVM(vmUUID: string) {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'PUT',
        url: `/zstack/v1/vm-instances/${vmUUID}/actions`,
        data: { startVmInstance: {} },
      })
    })
  }

  public async stopVM(vmUUID: string) {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'PUT',
        url: `/zstack/v1/vm-instances/${vmUUID}/actions`,
        data: { stopVmInstance: { type: 'grace' } },
      })
    })
  }

  public async rebootVM(vmUUID: string) {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'PUT',
        url: `/zstack/v1/vm-instances/${vmUUID}/actions`,
        data: { rebootVmInstance: {} },
      })
    })
  }

  public async vmOverview() {
    // eslint-disable-next-line max-len
    const zqlStr = 'count vminstance named as \'total\'; count vminstance where state = \'Running\' named as \'running\'; count vminstance where state = \'Stopped\' named as \'stopped\''
    const res = await this.zql(zqlStr)
    return res.results.reduce((prev, curr) => ({
      ...prev, [curr.name]: curr.total,
    }), {})
  }

  /**
   * 查询虚拟机状态
   * @param vmUUID
   */
  public async getVMState(vmUUID: string) {
    const zqlStr = `query vminstance.state,uuid,hypervisorType,architecture,cpuNum,memorySize,platform,guestOsType,uuid,lastOpDate where uuid='${vmUUID}'`
    const res = await this.zql(zqlStr)
    return res.results[0].inventories[0]
  }

  public async getVMStateDetail(vmUUID: string, period = 60) {
    // eslint-disable-next-line max-len
    const zqlStr = `query vminstance.uuid where uuid = '${vmUUID}' return with (zwatch{{resultName='CPU',metricName='CPUAverageUsedUtilization',offsetAheadOfCurrentTime=3600, period=${period}}}, zwatch{{resultName='memUsed',metricName='MemoryUsedInPercent',offsetAheadOfCurrentTime=3600, period=${period}}}, zwatch{{resultName='Disk',metricName='DiskAllUsedCapacityInPercent',offsetAheadOfCurrentTime=3600, period=${period}}},zwatch{{resultName='NetworkIn',metricName='NetworkAllInBytes',offsetAheadOfCurrentTime=3600, period=${period}}},zwatch{{resultName='NetworkOut',metricName='NetworkAllOutBytes',offsetAheadOfCurrentTime=3600, period=${period}}})`
    const res = await this.zql(zqlStr)
    return res.results[0].returnWith
  }
}
