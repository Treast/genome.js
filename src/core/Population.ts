import { Chromosome } from './Chromosome';
import { Blueprint } from './Blueprint';
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

  /**
   * Create a new population of `size` chromosomes
   *
   * @param  {number} size Size of the population
   * @param  {Blueprint} blueprint Blueprint of a chromosome
   */
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

  /**
   * Initialize each chromosome with genes, following the blueprint passed
   */
  initializeChromosomes() {
    for (let i = 0; i < this.size; i += 1) {
      const chromosome = new Chromosome(this.blueprint);
      this.chromosomes.push(chromosome);
    }
    GenomeEvent.dispatch(GenomeEventType.GENOME_EVENT_POPULATION_CREATED, this.chromosomes);
  }

  /**
   * @param  {any} fitnessCalculation Function that calculate the fitness of a chromosome based on its genes
   */
  setFitnessCalculation(fitnessCalculation: any) {
    this.fitnessCalculation = fitnessCalculation;
  }
  /**
   * @param  {number} fitness
   */
  setStopAt(fitness: number) {
    this.stopAt = fitness;
  }

  /**
   * Sort the chromosomes by their fitnesses
   */
  sortChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return a.getFitness() > b.getFitness() ? -1 : 1;
    });
  }

  /**
   * Kill chromosomes based on their fitnesses and the cutoff value
   */
  selectBestChromosomes() {
    const pivot = Math.floor(this.chromosomes.length * this.cutOff);
    const killedChromosomes = this.chromosomes.slice(this.chromosomes.length - pivot);
    const selectedChromosomes = this.chromosomes.slice(0, this.chromosomes.length - pivot + 1);

    killedChromosomes.map((chromosome: Chromosome) => {
      chromosome.kill();
    });

    this.sumFitness = 0;
    selectedChromosomes.map((chromosome: Chromosome) => {
      this.sumFitness += chromosome.getFitness();
    });
  }

  /**
   * Redefine killed chromosomes' genes with crossover
   */
  crossoverChromosomes() {
    const killedChromosomes = this.chromosomes.filter((chromosome: Chromosome) => {
      return chromosome.isKilled;
    });

    const selectedChromosomes = this.chromosomes.filter((chromosome: Chromosome) => {
      return !chromosome.isKilled;
    });

    for (let i = 0; i < killedChromosomes.length; i += 1) {
      let chromosomeA = null;
      let chromosomeB = null;

      do {
        chromosomeA = this.getRandomChromosome(selectedChromosomes);
        chromosomeB = this.getRandomChromosome(selectedChromosomes);
      } while (!chromosomeA || !chromosomeB);

      if (chromosomeA && chromosomeB) {
        const pivot = Math.floor(Math.random() * chromosomeA.getLength());
        const genesA = chromosomeA.getGenes().slice(0, pivot);
        const genesB = chromosomeB.getGenes().slice(pivot);
        killedChromosomes[i].setDNA([...genesA, ...genesB]);
      } else {
        // console.error('Should not happen');
      }
    }
  }

  /**
   * Set the mutation rate
   *
   * @param  {number} mutationRate
   */
  setMutationRate(mutationRate: number) {
    this.mutationRate = mutationRate;
  }

  /**
   * Set the cutoff rate
   *
   * @param  {number} cutOff
   */
  setCutOff(cutOff: number) {
    this.cutOff = cutOff;
  }

  /**
   * Mutate the chromosome based on the mutation rate
   */
  mutateChromosomes() {
    this.chromosomes.map((chromosome: Chromosome) => {
      if (Math.random() < this.mutationRate) {
        chromosome.mutate();
      }
    });
  }

  /**
   * Select a random chromosome in a list
   *
   * @param  {Chromosome[]} selectedChromosomes
   */
  getRandomChromosome(selectedChromosomes: Chromosome[]) {
    const random = Math.random() * this.sumFitness;
    let sumFitness = 0;
    for (const chromosome of selectedChromosomes) {
      sumFitness += chromosome.getFitness();
      if (random < sumFitness) {
        return chromosome;
      }
    }
    return null;
  }

  /**
   * Randomize the chromosomes index in the list
   */
  shuffleChromosomes() {
    this.chromosomes = this.chromosomes.sort((a: Chromosome, b: Chromosome) => {
      return Math.random() - 0.5;
    });
  }

  /**
   * Save the best chromosome into the population
   */
  keepBestChromosome() {
    if (this.bestChromosome) {
      if (this.bestChromosome.getFitness() < this.chromosomes[0].getFitness()) {
        this.bestChromosome = this.copyChromosome(this.chromosomes[0]);
      }
    } else {
      this.bestChromosome = this.copyChromosome(this.chromosomes[0]);
    }
  }

  /**
   * Clone the values of a chromosome
   *
   * @param  {Chromosome} chromosome
   * @returns Chromosome
   */
  copyChromosome(chromosome: Chromosome): Chromosome {
    // @ts-ignore
    return Object.assign(Object.create(Object.getPrototypeOf(chromosome)), chromosome);
  }

  /**
   * Run the process `rounds` times
   *
   * @param  {number=1} rounds
   */
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

  /**
   * Return the generation index
   *
   * @returns number
   */
  getGenerationNumber(): number {
    return this.index;
  }
  /**
   * Return the best chromosome
   *
   * @returns Chromosome
   */
  getBestChromosome(): Chromosome {
    return this.bestChromosome;
  }

  /**
   * Process the generation
   */
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
