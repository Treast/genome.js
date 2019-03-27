import { Chromosome } from './Chromosome';
import { Blueprint } from './Blueprint';

export class Population {
  private size: number;
  private blueprint: Blueprint;
  private chromosomes: Chromosome[];
  private fitnessCalculation: any;
  private sumFitness: number;

  constructor(size: number, blueprint: Blueprint) {
    this.size = size;
    this.blueprint = blueprint;
    this.chromosomes = [];
    this.sumFitness = 0;
    this.initializeChromosomes();
  }

  initializeChromosomes() {
    for (let i = 0; i < this.size; i += 1) {
      const chromosome = new Chromosome(this.blueprint);
      this.chromosomes.push(chromosome);
    }
  }

  setFitnessCalculation(fitnessCalculation: any) {
    this.fitnessCalculation = fitnessCalculation;
  }

  sortChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return a.getFitness() > b.getFitness() ? -1 : 1;
    });
  }

  selectBestChromosomes() {
    const pivot = Math.floor(this.size / 3);
    this.chromosomes.splice(2 * pivot);

    this.sumFitness = 0;
    this.chromosomes.map((chromosome: Chromosome) => {
      this.sumFitness += chromosome.getFitness();
    });
  }

  crossoverChromosomes() {
    for (let i = this.chromosomes.length; i < this.size; i += 1) {
      const chromosomeA = this.getRandomChromosome();
      const chromosomeB = this.getRandomChromosome();
      console.log('A', chromosomeA);
      console.log('B', chromosomeB);
    }
  }

  getRandomChromosome() {
    const random = Math.random() * this.sumFitness;
    let sumFitness = 0;
    for (const chromosome of this.chromosomes) {
      sumFitness += chromosome.getFitness();
      if (random < sumFitness) {
        return chromosome;
      }
    }
    return null;
  }

  run() {
    this.process();
  }

  process() {
    this.chromosomes.map((chromosome: Chromosome) => {
      chromosome.computeFitness(this.fitnessCalculation);
    });

    this.sortChromosomes();
    this.selectBestChromosomes();
    this.crossoverChromosomes();
  }
}
