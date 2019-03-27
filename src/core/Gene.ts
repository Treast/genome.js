export class Gene {
  private value: number;
  private factor: number;

  constructor(factor: number) {
    this.factor = factor;
    this.value = Math.random();
  }

  get() {
    return this.value * this.factor;
  }

  mutate() {
    this.value = Math.random();
  }
}
