import { Gene } from './Gene';
import { Blueprint } from './Blueprint';

export class Chromosome {
  private genes: Gene[];
  private fitness: number;
  constructor(blueprint: Blueprint | null = null) {
    this.genes = [];
    this.fitness = 0;

    if (blueprint) {
      this.initializeGenes(blueprint);
    }
  }

  initializeGenes(blueprint: Blueprint) {
    const properties = blueprint.getProperties();
    properties.map((property: number) => {
      const gene = new Gene(property);
      this.genes.push(gene);
    });
  }

  computeFitness(fitnessCalculation: any) {
    this.fitness = fitnessCalculation(this.genes);
  }

  static fromDNA(genes: Gene[]) {
    const chromosome = new Chromosome();
    chromosome.genes = genes;
    return chromosome;
  }

  mutate() {
    const pivot = Math.floor(Math.random() * this.genes.length);
    this.genes[pivot].mutate();
  }

  getFitness() {
    return this.fitness;
  }

  getLength() {
    return this.genes.length;
  }

  getGenes() {
    return this.genes;
  }
}
