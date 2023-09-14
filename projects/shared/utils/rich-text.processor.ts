export class RichTextProcessor {

  private _div!: HTMLDivElement;

  constructor(public raw: string) {
    if (typeof document !== 'undefined') {
      this._div = document.createElement('div');
      this._div.innerHTML = raw;
    }
  }

  static from(raw: string) {
    return new RichTextProcessor(raw);
  }


  lazyLoadImages() {
    const images = this._div.querySelectorAll('img');

    images.forEach((img: HTMLImageElement) => {
      img.setAttribute('loading', 'lazy');
    });
    return this;
  }

  get html() {
    return this._div.innerHTML;
  }
}