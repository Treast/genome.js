export default class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static random(): Color {
    const r = this.rand(0, 255);
    const g = this.rand(0, 255);
    const b = this.rand(0, 255);
    const a = Math.random();
    return new Color(r, g, b, a);
  }

  static rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  toRGBA() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  difference(color: Color) {
    const dR = Math.abs(this.r - color.r) / 255;
    const dG = Math.abs(this.g - color.g) / 255;
    const dB = Math.abs(this.b - color.b) / 255;
    const dA = Math.abs(this.a - color.a);
    return ((dR + dG + dB + dA) * 100) / 4;
  }
}
