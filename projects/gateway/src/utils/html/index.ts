export class HtmlTag {
  private _style: Record<string, any> = {}
  private _children: HtmlTag[] = []

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

  style(key: string, value: any) {
    this._style[key] = value
    return this
  }

  child(tag: HtmlTag) {
    this._children.push(tag)
    return this
  }

  raw() {
    return `<${this.tagName} ${Object.entries(this.attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}>
      ${this._children.map(c => c.raw()).join('\n')}
    </${this.tagName}>`
  }
}
