import { Chromosome } from './Chromosome';
import { Blueprint } from './Blueprint';
import { Gene } from './Gene';
import { GenomeEvent, GenomeEventType } from './GenomeEvent';

export class Population {
  private size: number;
  private blueprint: Blueprint;
  private chromosomes: Chromosome[];
  private sumFitness: number;
  private mutationRate: number;
  private cutOff: number;
  private bestChromosome: Chromosome;
  private index: number;

  private fitnessCalculation: any;
  private stopAt: number | null;

  constructor(size: number, blueprint: Blueprint) {
    this.index = 0;
    this.size = size;
    this.blueprint = blueprint;
    this.chromosomes = [];
    this.bestChromosome = new Chromosome();
    this.sumFitness = 0;
    this.mutationRate = 0.01;
    this.stopAt = null;
    this.cutOff = 0.3;
    this.initializeChromosomes();
  }

  initializeChromosomes() {
    for (let i = 0; i < this.size; i += 1) {
      const chromosome = new Chromosome(this.blueprint);
      this.chromosomes.push(chromosome);
    }
    GenomeEvent.dispatch(GenomeEventType.GENOME_EVENT_POPULATION_CREATED, this.chromosomes);
  }

  setFitnessCalculation(fitnessCalculation: any) {
    this.fitnessCalculation = fitnessCalculation;
  }

  setStopAt(fitness: number) {
    this.stopAt = fitness;
  }

  sortChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return a.getFitness() > b.getFitness() ? -1 : 1;
    });
  }

  selectBestChromosomes() {
    const pivot = Math.floor(this.chromosomes.length * this.cutOff);
    this.chromosomes.splice(this.chromosomes.length - pivot);

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
        const newChromosome = Chromosome.fromDNA([...genesA, ...genesB], chromosomeA.getConstants());
        newChromosomes.push(newChromosome);
      } else {
        // console.error('Should not happen');
      }
    }
    this.chromosomes = [...this.chromosomes, ...newChromosomes];
  }

  setMutationRate(mutationRate: number) {
    this.mutationRate = mutationRate;
  }

  setCutOff(cutOff: number) {
    this.cutOff = cutOff;
  }

  mutateChromosomes() {
    this.chromosomes.map((chromosome: Chromosome) => {
      if (Math.random() < this.mutationRate) {
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

  shuffleChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return Math.random() - 0.5;
    });
  }

  keepBestChromosome() {
    if (this.bestChromosome) {
      if (this.bestChromosome.getFitness() < this.chromosomes[0].getFitness()) {
        this.bestChromosome = this.copyChromosome(this.chromosomes[0]);
      }
    } else {
      this.bestChromosome = this.copyChromosome(this.chromosomes[0]);
    }
  }

  copyChromosome(chromosome: Chromosome): Chromosome {
    // @ts-ignore
    return Object.assign(Object.create(Object.getPrototypeOf(chromosome)), chromosome);
  }

  run(rounds: number = 1) {
    if (!this.fitnessCalculation)
      throw new Error("You must specify a fitness calculation function using 'setFitnessCalculation'.");

    if (!this.blueprint) throw new Error('You must specify a blueprint to design your chromosomes.');

    for (let i = 0; i < rounds; i += 1) {
      this.index += 1;
      this.process();

      if (this.stopAt && this.bestChromosome.getFitness() >= this.stopAt) {
        break;
      }
    }

    GenomeEvent.dispatch(GenomeEventType.GENOME_EVENT_GENERATION_FINISH, this.chromosomes);
  }

  getGenerationNumber() {
    return this.index;
  }

  getBestChromosome() {
    return this.bestChromosome;
  }

  process() {
    GenomeEvent.dispatch(GenomeEventType.GENOME_EVENT_GENERATION_BEGIN, this.chromosomes);

    this.shuffleChromosomes();

    this.chromosomes.map((chromosome: Chromosome) => {
      chromosome.computeFitness(this.fitnessCalculation);
    });

    this.sortChromosomes();
    this.selectBestChromosomes();
    this.crossoverChromosomes();
    this.mutateChromosomes();
    this.keepBestChromosome();

    GenomeEvent.dispatch(GenomeEventType.GENOME_EVENT_GENERATION_END, this.chromosomes);
  }
}
