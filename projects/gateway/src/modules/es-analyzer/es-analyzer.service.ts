import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from '@elastic/elasticsearch'
import type { ClientOptions } from '@elastic/elasticsearch'
import { CustomDslParser } from 'src/utils/es/custom-dsl-parser'

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

  public dsl2query(dsl: string, mapping: EsMapping) {
    const expParser = new CustomDslParser(mapping)
    return expParser.parse(dsl)
  }

  /**
   * 根据dsl分页查找
   * @param dsl
   * @param pagination
   * @param options
   */
  public async queryByDsl(
    dsl: string,
    pagination: { page?: number; pageSize?: number },
    options: {
      mapping: EsMapping
      index: string
      sort?: any
      fields?: string[]
    },
  ) {
    const paginationOpt = {
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
    }
    const from = (paginationOpt.page - 1) * paginationOpt.pageSize

    const client = this.getClient()
    const query = this.dsl2query(dsl, options.mapping)
    const body = { query, from, size: paginationOpt.pageSize }
    const esSearchRes = await client.search({ index: options.index, body })
    return {
      // dsl: query,
      ...(await this._resolveSearchResult(
        esSearchRes,
        paginationOpt,
        options?.fields,
      )),
    }
  }

  public async proxyQuery(index: string, body: any) {
    return await this.getClient().search({
      index,
      body,
    })
  }

  /**
     * 处理查询结果
     * @param res
     * @returns
     */
  private async _resolveSearchResult(
    res,
    paginationOpt: { page?: number; pageSize?: number },
    select?: string[],
  ) {
    const selectTree = {}
    select?.forEach((field) => {
      const path = field.split('.')
      let pointer = selectTree
      path.forEach((key, index) => {
        if (!pointer[key])
          pointer[key] = 1
        if (index !== path.length - 1)
          pointer[key] = {}
        else
          pointer[key] = 1
        pointer = pointer[key]
      })
    })

    const records = (res?.body?.hits?.hits || []).map((hit) => {
      const highlight = hit.highlight || {}
      const highlightFields = Object.keys(highlight)
      const highlightFieldsMap = highlightFields.reduce(
        (dict: Record<string, any>, key) => ({
          ...(dict || {}),
          [key]: highlight[key].join(';'),
        }),
        undefined,
      )

      const pick = (obj, tree) => {
        const res = {}
        Object.entries(obj).forEach(([key, value]) => {
          if (tree[key] === 1) {
            res[key] = value
          }
          else if (typeof tree[key] === 'object') {
            if (Array.isArray(value))
              res[key] = value.map(item => pick(item, tree[key]))
            else if (typeof value === 'object')
              res[key] = pick(value, tree[key])
            else
              res[key] = value
          }
        })
        return res
      }

      const source = select?.length ? pick(hit._source, selectTree) : hit._source
      return {
        id: hit._id,
        score: hit._score,
        highlight: highlightFieldsMap,
        ...source,
      }
    })
    const totalValue = res?.body?.hits?.total?.value || 0
    return {
      total: { ...(res?.body?.hits?.total || {}), value: totalValue },
      page: paginationOpt.page,
      pageSize: paginationOpt.pageSize,
      pages: Math.ceil(totalValue / paginationOpt.pageSize),
      max_score: res?.body?.hits?.max_score,
      records,
    }
  }
}
