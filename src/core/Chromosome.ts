import { Gene } from './Gene';
import { Blueprint } from './Blueprint';

export class Chromosome {
  private genes: Gene[];
  private fitness: number;
  constructor(blueprint: Blueprint) {
    this.genes = [];
    this.fitness = 0;
    this.initializeGenes(blueprint);
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

  getFitness() {
    return this.fitness;
  }
}
