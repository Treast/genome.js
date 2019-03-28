import { Chromosome } from './Chromosome';
import { Blueprint } from './Blueprint';
import { Gene } from './Gene';

export class Population {
  private size: number;
  private blueprint: Blueprint;
  private chromosomes: Chromosome[];
  private sumFitness: number;

  private fitnessCalculation: any;
  private render: any;

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

  setRender(render: any) {
    this.render = render;
  }

  sortChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return a.getFitness() > b.getFitness() ? -1 : 1;
    });
  }

  selectBestChromosomes() {
    const pivot = Math.floor(this.chromosomes.length / 3);
    this.chromosomes.splice(2 * pivot);

    this.sumFitness = 0;
    this.chromosomes.map((chromosome: Chromosome) => {
      this.sumFitness += chromosome.getFitness();
    });
  }

  crossoverChromosomes() {
    let newChromosomes = [];
    for (let i = this.chromosomes.length; i < this.size; i += 1) {
      let chromosomeA = null;
      let chromosomeB = null;

      do {
        chromosomeA = this.getRandomChromosome();
        chromosomeB = this.getRandomChromosome();
      } while (!chromosomeA || !chromosomeB);

      if (chromosomeA && chromosomeB) {
        const pivot = Math.floor(Math.random() * chromosomeA.getLength());
        const genesA = chromosomeA.getGenes().slice(0, pivot);
        const genesB = chromosomeB.getGenes().slice(pivot);
        const newChromosome = Chromosome.fromDNA([...genesA, ...genesB]);
        newChromosomes.push(newChromosome);
      } else {
        // console.error('Should not happen');
      }
    }
    this.chromosomes = [...this.chromosomes, ...newChromosomes];
  }

  mutateChromosones() {
    const mutationRate = 0.005;
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
      if (this.render) {
        this.render(this.chromosomes);
      }
      console.log(`Generation ${i}: ${this.chromosomes[0].getFitness()} (remaining: ${this.chromosomes.length})`);
    }
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
