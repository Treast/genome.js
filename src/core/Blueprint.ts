export class Blueprint {
  private properties: number[];
  constructor() {
    this.properties = [];
  }

  add(factor: number, times: number = 1) {
    for (let i = 0; i < times; i += 1) {
      this.properties.push(factor);
    }
  }

  getProperties() {
    return this.properties;
  }
}
