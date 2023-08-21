import { HttpException, HttpStatus } from '@nestjs/common'

import { esHelper } from './es-helper'

export interface CustomDslParserOptions {
  /** 可用的引号标识数组 */
  quoteSymbols?: string[]
  /** 可用的关键字数组 */
  keywords?: string[]
}

interface ExpNode {
  exp: string
  sub?: ExpNode[] | null
}

interface Mapping {
  properties: Record<string, Property>
}
interface Property {
  type: string
  fields?: Record<string, Property>
}

const defaultOptions = {
  quoteSymbols: ['"', '\'', '`'],
  keywords: [
    'and',
    'or',
    'not',
    'in',
    'notin',
    'like',
    'exists',
    'isnull',
    'isnotnull',
    'has',
    'nothas',
    'notlike',
  ],
}
export class CustomDslParser {
  private _mapping: Mapping
  private _options: CustomDslParserOptions

  constructor(mapping: Mapping, options?: CustomDslParserOptions) {
    this._mapping = mapping
    this._options = Object.assign({}, defaultOptions, options)

    if (!this._options.keywords?.length)
      throw new Error('keywords is required')

    if (!this._options.quoteSymbols?.length)
      throw new Error('quoteSymbols is required')
  }

  private _upperCaseExp(exp: string) {
    const reg = new RegExp(
      `\\s+(${this._options.keywords.join('|')})\\s+`,
      'gi',
    )
    return exp.replace(reg, (match, $1) => ` ${$1.toUpperCase()} `)
  }

  private _expToTree(exp: string): ExpNode {
    const checkMinExp = (exp: string) => {
      // 检查是否同时包含 AND 和 OR
      const andReg = /\s+AND\s+/g
      const orReg = /\s+OR\s+/g
      if (andReg.test(exp) && orReg.test(exp)) {
        throw new HttpException(
          {
            message:
              '在一个最小表达式中，不能同时包含 AND 和 OR， 请使用括号包裹',
            error: 'Invalid expression',
          },
          HttpStatus.BAD_REQUEST,
        )
      }
    }
    const stack = []
    let newExp = ''
    let _id = 0
    const sub = []

    for (let i = 0; i < exp.length; i++) {
      const char = exp[i]
      if (char === '(') {
        stack.push(i)
      }
      else if (char === ')') {
        const startIndex = stack.pop()
        if (stack.length === 0) {
          // 找到了一个完整的表达式
          const subExp = exp.substring(startIndex + 1, i)
          // const subExp = exp.substr(startIndex + 1, i - startIndex - 1);
          const id = `$${_id++}`

          const subExpTree = this._expToTree(subExp)
          // 校验是否是 "ACCS", "DSa", "dsad13" 或 'dsada', 'fafa', '3fs' 或 123, 321, "213" 的形式
          const qs = this._options.quoteSymbols.map(s => `(${s}[^${s}]*${s})`)
          const unit = `(${qs.join('|')}|\d+)`
          // /^(("[^"]*")|('[^']*')|\d+)(\s*,\s*(("[^"]*")|('[^']*')|\d+))*\s*$/;
          const reg = new RegExp(`^${unit}(\\s*,\\s*${unit})*\\s*$`)
          if (reg.test(subExpTree.exp) && !subExpTree.sub) {
            // 是一个符合 IN/NOTIN 的简单的表达式
            newExp += `(${subExpTree.exp})`
            _id--
          }
          else {
            newExp += id
            sub.push(subExpTree)
          }
        }
        continue
      }
      if (!stack.length)
        newExp += char
    }
    checkMinExp(newExp)
    return {
      exp: newExp,
      sub: sub.length ? sub : null,
    }
  }

  private _parseTreeNode(node: ExpNode) {
    const relation = node.exp.match(/\s+AND\s+/g)
      ? 'AND'
      : node.exp.match(/\s+OR\s+/g)
        ? 'OR'
        : 'NULL'
    const reg = /\s+AND\s+|\s+OR\s+/

    const items = node.exp.split(reg).map((item) => {
      const el = item.trim()
      if (el.match(/(\$\d+)/)) {
        const index = el.substring(1)
        return this._parseTreeNode(node.sub[index])
      }
      else {
        return this._parseItem(el)
      }
    })
    if (items.length === 1)
      return items[0]

    return relation === 'AND'
      ? { bool: { must: items } }
      : relation === 'OR'
        ? { bool: { should: items } }
        : items[0]
  }

  private _parseItem(exp) {
    const extractField = (exp) => {
      const reg = /\${(.+?)}/
      const match = exp.match(reg)
      return match?.[1]
    }
    const removeQuote = (str) => {
      for (const symbol of this._options.quoteSymbols) {
        if (str.startsWith(symbol) && str.endsWith(symbol))
          return str.substr(1, str.length - 2)
      }
      return str
    }
    const splitAndTrim = (str, symbol) =>
      str.split(symbol).map(item => removeQuote(item.trim()))

    // 处理text类型的精确匹配
    const handleTermField = (field: string) => {
      const { properties } = this._mapping
      const fieldMapping = properties?.[field]
      if (fieldMapping?.type === 'keyword')
        return field
      if (fieldMapping?.type === 'text') {
        // 找到 text 类型的字段的 keyword 字段
        const subFields = fieldMapping.fields
        if (!subFields)
          return field
        const keywordField = Object.keys(subFields).find(
          key => subFields[key].type === 'keyword',
        )
        if (keywordField)
          return `${field}.${keywordField}`
      }
      return field
    }

    let field, query
    // 范围类型
    const ranges = ['<=', '>=', '<', '>']
    if (ranges.some(range => exp.includes(range))) {
      const range = ranges.find(range => exp.includes(range))
      const [fieldExp, value] = splitAndTrim(exp, range)
      field = extractField(fieldExp)
      query = esHelper.range(field, range, value)
    }
    else if (exp.match(/\s+HAS\s+/)) {
      const [fieldExp, value] = splitAndTrim(exp, /\s+HAS\s+/)
      field = extractField(fieldExp)
      query = esHelper.match(field, value)
    }
    else if (exp.match(/\s+NOTHAS\s+/)) {
      const [fieldExp, value] = splitAndTrim(exp, /\s+NOTHAS\s+/)
      field = extractField(fieldExp)
      query = esHelper.not(esHelper.match(field, value))
    }
    else if (exp.match(/\s+IN\s+/) || exp.match(/\s+NOTIN\s+/)) {
      const isIn = exp.match(/\s+IN\s+/)
      const [fieldExp, values] = isIn
        ? splitAndTrim(exp, /\s+IN\s+/)
        : splitAndTrim(exp, /\s+NOTIN\s+/)
      const termValues = splitAndTrim(
        values.replace('(', '').replace(')', ''),
        ',',
      ).map(el => removeQuote(el))
      field = handleTermField(extractField(fieldExp))
      const termQuery = esHelper.terms(field, termValues)
      query = isIn ? termQuery : esHelper.not(termQuery)
    }
    else if (exp.match(/\s+ISNULL\s*/)) {
      const [fieldExp] = splitAndTrim(exp, /\s+ISNULL\s*/)
      field = extractField(fieldExp)
      query = esHelper.not(esHelper.exists(field))
    }
    else if (exp.match(/\s+ISNOTNULL\s*/)) {
      const [fieldExp] = splitAndTrim(exp, /\s+ISNOTNULL\s*/)
      field = extractField(fieldExp)
      query = esHelper.exists(field)
    }
    else if (exp.match(/\s+LIKE\s+/)) {
      const [fieldExp, value] = splitAndTrim(exp, /\s+LIKE\s+/)
      field = extractField(fieldExp)
      query = esHelper.matchPhrase(field, value)
    }
    else if (exp.match(/\s+NOTLIKE\s+/)) {
      const [fieldExp, value] = splitAndTrim(exp, /\s+NOTLIKE\s+/)
      field = extractField(fieldExp)
      query = esHelper.not(esHelper.matchPhrase(field, value))
    }
    else if (exp.match(/!=/)) {
      const [fieldExp, value] = splitAndTrim(exp, /!=/)
      field = handleTermField(extractField(fieldExp))
      query = esHelper.not(esHelper.term(field, value))
    }
    else if (exp.match(/=/)) {
      const [fieldExp, value] = splitAndTrim(exp, /=/)
      field = handleTermField(extractField(fieldExp))
      query = esHelper.term(field, value)
    }
    else {
      return esHelper.term(exp, true)
    }

    if (field.match(/\./)) {
      const [root] = field.split('.')
      const { properties } = this._mapping
      const fieldMapping = properties?.[root]

      if (fieldMapping?.type === 'nested')
        return esHelper.nested(root, query)

      else
        return query
    }

    return query
  }

  public parse(exp: string): any {
    if (!exp)
      return esHelper.matchAll()

    const upperExp = this._upperCaseExp(exp)
    const tree = this._expToTree(upperExp)
    return this._parseTreeNode(tree)
  }
}
