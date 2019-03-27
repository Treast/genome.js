import { Population } from './core/Population';
import { Blueprint } from './core/Blueprint';
import { Gene } from './core/Gene';

const answer = 'helloworld';

const blueprint = new Blueprint();
blueprint.add(26, answer.length);

const population = new Population(10, blueprint);

population.setFitnessCalculation((genes: Gene[]) => {
  let sum = 0;

  for (let i = 0; i < genes.length; i += 1) {
    const charCode = answer.charCodeAt(i) - 97;
    const geneCharCode = Math.floor(genes[i].get());
    sum += Math.abs(charCode - geneCharCode);
  }

  return 1 / (sum * sum);
});

population.run();
