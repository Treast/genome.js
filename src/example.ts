/*
 * This example is based on the "infinite monkey theorem" (https://en.wikipedia.org/wiki/Infinite_monkey_theorem)
 *
 * The algorithm tries to reproduce a specific text input, here "helloworldhowareyoutoday" in a minimum generations.
 */

// Importing all the dependencies
import { Population, Blueprint, Gene, Chromosome, GenomeEvent, GenomeEventType } from './main';

// Defining the string to reproduce
const answer = 'helloworldhowareyoutoday';

// We create a blueprint to represent the data structure of a chromosome
const blueprint = new Blueprint();
// Our chromosomes will have 'answer.length' genes between 0 and 26 (not included), so that each gene can represent one letter of the alphabet
blueprint.add(26, answer.length);

// We generate a population of 500 chromosomes using our blueprint
const population = new Population(500, blueprint);

// Just some basic configurations
population.setMutationRate(0.01);
population.setCutOff(0.5);
population.setStopAt(100); // We stop the processing when a chromosome reach AT LEAST 100 on his fitness

// We define now the function that calculate the fitness of every chromosome on each generation
// Be sure to never return 0 (cause a bug, WIP)
population.setFitnessCalculation((genes: Gene[]) => {
  let sum = 1; // Avoid to have 0 on fitness

  for (let i = 0; i < genes.length; i += 1) {
    const charCode = answer.charCodeAt(i) - 97;
    const geneCharCode = Math.floor(genes[i].get());
    // If the gene value is corresponding with the answer letter at the same location, then increment 'sum'
    if (charCode === geneCharCode) {
      sum += 1;
    }
  }

  // Basically a percent of correct genes' values
  return (sum / (genes.length + 1)) * 100;
});

// We wait for a generation to end, and we display the best chromosome fitness into the console
GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_END, (chromosomes: Chromosome[]) => {
  const bestChromosome = chromosomes[0];
  console.log(`Generation ${population.getGenerationNumber()}: ${bestChromosome.getFitness()}`);
});

// Once the process in finished (when a chromosome reach the fitness limit or the process has reach the round limit), we display the string contained in its genes
GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_FINISH, (chromosomes: Chromosome[]) => {
  let finalString = '';
  const bestChromosome = chromosomes[0];
  bestChromosome.getGenes().map((gene: Gene) => {
    finalString += String.fromCharCode(gene.get() + 97);
  });
  console.log(`Result (fitness: ${bestChromosome.getFitness()}): ${finalString}`);
});

// We process the algorithm throught 500 rounds (more options comming soon)
population.run(500);
