import { Chromosome } from './Chromosome';
import { Blueprint } from './Blueprint';
import { Gene } from './Gene';

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

      if (chromosomeA && chromosomeB) {
        const pivot = Math.floor(Math.random() * chromosomeA.getLength());
        const genesA = chromosomeA.getGenes().slice(0, pivot);
        const genesB = chromosomeB.getGenes().slice(pivot);
        const newChromosome = Chromosome.fromDNA([...genesA, ...genesB]);
        this.chromosomes.push(newChromosome);
      } else {
        console.error('Should not happen');
      }
    }
  }

  mutateChromosones() {
    const mutationRate = 0.01;
    this.chromosomes.map((chromosome: Chromosome) => {
      if (Math.random() < mutationRate) {
        chromosome.mutate();
      }
    });
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

  run(times: number = 1) {
    for (let i = 0; i < times; i += 1) {
      this.process();
      console.log(`Generation ${i}: ${this.chromosomes[0].getFitness()}`);
    }
    let finalString = '';
    this.chromosomes[0].getGenes().map((gene: Gene) => {
      finalString += String.fromCharCode(gene.get() + 97);
    });
    console.log(`Result: ${finalString}`);
  }

  process() {
    this.chromosomes.map((chromosome: Chromosome) => {
      chromosome.computeFitness(this.fitnessCalculation);
    });

    this.sortChromosomes();
    this.selectBestChromosomes();
    this.crossoverChromosomes();
    this.mutateChromosones();
  }
}
