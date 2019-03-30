export class Blueprint {
  private properties: number[];
  private constants: number[];
  constructor() {
    this.properties = [];
    this.constants = [];
  }

  add(factor: number, times: number = 1) {
    for (let i = 0; i < times; i += 1) {
      this.properties.push(factor);
    }
  }

  addConstant(factor: number, times: number = 1) {
    for (let i = 0; i < times; i += 1) {
      this.properties.push(factor);
    }
  }

  getProperties() {
    return this.properties;
  }

  getConstants() {
    return this.constants;
  }
}
