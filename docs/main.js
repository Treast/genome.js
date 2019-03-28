const textInput = document.getElementById('input');
const sizeInput = document.getElementById('size');
const mutationInput = document.getElementById('mutation');
const cutoffInput = document.getElementById('cutoff');
const generationInput = document.getElementById('generation');
const fitnessInput = document.getElementById('fitness');
const timeInput = document.getElementById('time');
const textOutput = document.getElementById('output');
const runButton = document.getElementById('run');

let population = null;
let startTime = null;

GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_END, chromosomes => {
  const bestChromosome = chromosomes[0];
  generationInput.value = population.getGenerationNumber();
  fitnessInput.value = bestChromosome.getFitness();

  let finalString = '';
  bestChromosome.getGenes().map(gene => {
    finalString += String.fromCharCode(gene.get() + 96);
  });

  textOutput.value = `${population.getGenerationNumber()} - ${finalString}\n${textOutput.value}`;
});

GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_FINISH, chromosomes => {
  // @ts-ignore
  timeInput.value = `${new Date() - startTime}ms`;
});

runButton.addEventListener('click', () => {
  let input = textInput.value;
  input = input.toLowerCase().replace(/[^a-z]+/g, '');
  textInput.value = input;

  textOutput.value = '';

  const blueprint = new Blueprint();
  blueprint.add(26, input.length);

  population = new Population(parseInt(sizeInput.value), blueprint);

  population.setMutationRate(parseFloat(mutationInput.value));
  population.setCutOff(parseFloat(cutoffInput.value));
  population.setStopAt(100);

  population.setFitnessCalculation(genes => {
    let sum = 1; // Avoid to have 0 on fitness

    for (let i = 0; i < genes.length; i += 1) {
      const charCode = input.charCodeAt(i) - 96;
      const geneCharCode = Math.floor(genes[i].get()) + 1;
      if (charCode === geneCharCode) {
        sum += 1;
      }
    }

    return (sum / (genes.length + 1)) * 100;
  });

  startTime = new Date();
  population.run(500);
});
