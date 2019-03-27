import { Population } from './core/Population';
import { Blueprint } from './core/Blueprint';
import { Gene } from './core/Gene';

const answer = 'helloworldhowareyoutoday';

const blueprint = new Blueprint();
blueprint.add(26, answer.length);

const population = new Population(500, blueprint);

population.setFitnessCalculation((genes: Gene[]) => {
  let sum = 1;

  for (let i = 0; i < genes.length; i += 1) {
    const charCode = answer.charCodeAt(i) - 97;
    const geneCharCode = Math.floor(genes[i].get());
    sum += charCode === geneCharCode ? 1 : 0;
  }

  return sum / genes.length;
});

population.run(1000);
