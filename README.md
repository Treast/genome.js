
# genome.js

*genome.js* is a Javascript to help build insane genetics algorithms in a few minutes.

  

## Concept

### General terms

-  **Population**: a subset of the possible solutions to the problem (ie. subset of *chromosomes*)

-  **Chromosome**: a specific solution to the problem

-  **Gene**: a value defining a chromosome

  

### Specific terms

-  **Blueprint**: a schema defining the structure of every *gene* (number and possible values) in a *chromosome*.

## Installation (via NPM)

  

```npm install --save genome.js```

  

## Documentation

### Population
|Methods|Return type|Description|
|--|--|--|
| `constructor(size:  number,  blueprint:  Blueprint)` |`Population`|Create a population with *`size`* chromosomes using the *`blueprint`*|
|`setFitnessCalculation(fitnessCalculation:  any)`|`null`|Set the fitness calculation function. It should return a `number` value corresponding to the fitness of a chromosome.|
| `setStopAt(fitness:  number)` |`null`|Stop the process once a chromosome reaches **AT LEAST** *`fitness`* value on its fitness.|
| `setMutationRate(mutationRate:  number)` |`null`|Set the mutation rate value. It should be between `0` *(no mutation at all)* and `1` *(every chromosome will be mutated)*|
| `setCutOff(cutOff:  number)` |`null`|Set the cut off value. It should be between `0` *(no chromosome will be removed)* and `1` *(every chromosome will be removed)*|
| `run(rounds:  number  =  1)` |`null`|Run the process *`rounds`* times.|
| `getGenerationNumber()` |`number`|Return the current round number.|
| `getBestChromosome()` |`Chromosome`|Return the best chromosome.|


### Chromosome
|Methods|Return type|Description|
|--|--|--|
| `getGenes()` |`Gene[]`|Return the genes of the chromosome.|
| `getFitness()` |`Gene[]`|Return the fitness of the chromosome.|

### Gene
|Methods|Return type|Description|
|--|--|--|
| `get()` |`number`|Return the allele (value) of the gene.|

### Blueprint
|Methods|Return type|Description|
|--|--|--|
| `constructor()` |`Blueprint`|Create a new *`Blueprint`*.|
| `add(factor:  number,  times:  number  =  1)` |`null`|Define a property into the blueprint. The *`factor`* is used when you get back the allele (value) of a gene *(ex: a gene created with `add(26)` will return a `number` between `0` and `25`)*. You can add *`times`* a property by setting the *`times`* parameter.|

### GenoveEvent
|Methods|Return type|Description|
|--|--|--|
| `static  on(eventType:  GenomeEventType,  callback:  any)` |`null`|***STATIC*** Run the `callback` function when the event `eventType` is trigger.|

## Events

|Name|Description|
|--|--|
|`GENOME_EVENT_POPULATION_CREATED`|Trigger when all chromosomes are initialized|
|`GENOME_EVENT_GENERATION_BEGIN`|Trigger when a new generation is processed|
|`GENOME_EVENT_GENERATION_END`|Trigger when a generation is done processing|
|`GENOME_EVENT_GENERATION_FINISH`|Trigger when the all processing is done *(rounds limit or fitness limit)*|

## Example

	/*
	* This example is based on the "infinite monkey theorem" (https://en.wikipedia.org/wiki/Infinite_monkey_theorem)
	*
	* The algorithm tries to reproduce a specific text input, here "helloworldhowareyoutoday" in a minimum rounds.
	*/

	// Importing all the dependencies
	import { Population, Blueprint, Gene, Chromosome, GenomeEvent, GenomeEventType } from 'genome.js';

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

