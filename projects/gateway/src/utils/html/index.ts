import { camel2Dash } from 'zjf-utils'

export class HtmlTag {
  private _style: Record<string, any> = {}
  private _children: Array<HtmlTag | string> = []

  constructor(
    public tagName: string,
    public attrs: Record<string, any> = {},
  ) {}

  static create(tagName: string, attrs: Record<string, any> = {}) {
    return new HtmlTag(tagName, attrs)
  }

  color(value: string) {
    this.style('color', value)
    return this
  }

  attr(key: string, value: any) {
    this.attrs[key] = value
    return this
  }

  style(obj: Record<string, any>): HtmlTag
  style(key: string, value: any): HtmlTag
  style(key: string | Record<string, any>, value?: any) {
    if (typeof key === 'object') {
      const obj = key
      Object.entries(obj).forEach(([k, v]) => {
        this._style[k] = v
      })
    }
    else {
      this._style[key] = value
    }
    return this
  }

  text(value: string) {
    this._children.push(value)
    return this
  }

  appendChild(...tags: (HtmlTag | null)[]) {
    this._children.push(...tags.filter(t => !!t))
    return this
  }

  removeChild(tag: HtmlTag) {
    this._children = this._children.filter(t => t !== tag)
    return this
  }

  indent(size = '2em') {
    this.style('text-indent', size)
    return this
  }

  raw() {
    const styleRaw = Object.keys(this._style).length ? `style="${Object.entries(this._style).map(([k, v]) => `${camel2Dash(k)}: ${v}`).join('; ')}"` : ''
    return `<${this.tagName} 
      ${styleRaw}
      ${Object.entries(this.attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}
    >
      ${this._children.map(c => typeof c === 'string' ? c : c.raw()).join('\n')}
    </${this.tagName}>`
  }
}
