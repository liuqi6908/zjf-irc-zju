import { EventEmitter } from 'node:stream'
import { hashObject } from 'zjf-utils'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import type { AxiosRequestConfig } from 'axios'

@Injectable()
export class RequestService extends EventEmitter {
  private readonly _queue = new Map<string, Promise<any>>()

  constructor(private readonly _httpSrv: HttpService) {
    super()
  }

  public requestWithoutCache<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this._httpSrv.axiosRef(config).then(response => response.data)
  }

  public request<T = any>(config: AxiosRequestConfig, timeout = 10000) {
    const id = hashObject(config)
    const eventName = `request:${id}`

    return new Promise<T>((_resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('请求超时')), timeout)

      const resolve = (data) => {
        clearTimeout(timer)
        this._queue.delete(id)
        _resolve(data)
      }

      if (this._queue.has(id)) {
        this.once(eventName, resolve)
      }
      else {
        this._queue.set(id, this._httpSrv.axiosRef(config).then((response) => {
          this.emit(eventName, response.data)
          resolve(response.data)
        }).catch(reject))
      }
    })
  }
}
