# genome.js
*genome.js* is a Javascript to help build insane genetics algorithms in a few minutes.

## Concept
### General terms
- **Population**: a subset of the possible solutions to the problem (ie. subset of *chromosomes*)
- **Chromosome**: a specific solution to the problem
- **Gene**: a value defining a chromosome

### Specific terms
- **Blueprint**: a schema defining the structure of every *gene* (number and possible values) in a *chromosome*.
## Installation (via NPM)

	npm install --save genome.js
	
## Example

	// Import all the dependencies
    import  {  Population, Blueprint, Gene, Chromosome  }  from  'genome.js';
	
	// Defining the answer
	const  answer  =  'helloworldhowareyoutoday';
	
	// We create a blueprint to represent the data structure of a chromosome
	const  blueprint  =  new  Blueprint();
	// Our chromosomes will have 'answer.length' genes between 0 and 26 (not included), so that each gene can represent one letter of the alphabet
	blueprint.add(26,  answer.length);

	// We generate a population of 200 chromosomes using our blueprint
	const  population  =  new  Population(200,  blueprint);
  
	// We define now the function that calculate the fitness of every chromosome on each generation
	// Be sure to never return 0 (cause a bug, WIP)
	population.setFitnessCalculation((genes:  Gene[])  =>  {
		let  sum  =  1;  // Avoid to have 0 on fitness

		for (let  i  =  0;  i  <  genes.length;  i  +=  1) {
			const  charCode  =  answer.charCodeAt(i) -  96;
			const  geneCharCode  =  Math.floor(genes[i].get());
			// If the gene value is corresponding with the answer letter at the same location, then increment 'sum'
			if (charCode  ===  geneCharCode) {
				sum  +=  1;
			}
		}

		// Basically a percent of correct genes' values
		return  sum  / (genes.length +  1);
	});

	// The 'render' function will be executed at the end of every generation, can be usefull to see the progression of the algorithm
	population.setRender((chromosomes: Chromosome[]) => {
		let finalString = '';
		chromosomes[0].getGenes().map((gene: Gene) => {
			finalString += String.fromCharCode(gene.get() + 97);
		});

		console.log(`Result: ${finalString}`);
	});

	// We process the algorithm throught 1000 generations (more options comming soon)
	population.run(1000);
