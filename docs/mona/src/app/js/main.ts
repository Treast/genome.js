import App from './utils/App';
// @ts-ignore
import { Population, Blueprint, Gene, Chromosome, GenomeEvent, GenomeEventType } from 'genome.js';
import Canvas from './core/Canvas';
import Color from './core/Color';

const app = new App();

// @ts-ignore
app.isReady().then(async () => {
  await Canvas.init('./assets/mona.jpg');

  const blueprint = new Blueprint();
  blueprint.addConstant(Canvas.width / 2);
  blueprint.addConstant(Canvas.height);
  blueprint.add(20);
  blueprint.add(256, 3);

  const population = new Population(3000, blueprint);

  population.setMutationRate(0.02);
  population.setCutOff(0.5);

  population.setFitnessCalculation((genes: Gene[], constants: Gene[]) => {
    let fitness = 1;
    const x = Math.floor(constants[0].get());
    const y = Math.floor(constants[1].get());
    const radius = Math.floor(genes[0].get()) + 1;
    const r = Math.floor(genes[1].get());
    const g = Math.floor(genes[2].get());
    const b = Math.floor(genes[3].get());
    // console.log(x - radius, y - radius, x + radius, y + radius);
    // console.log(Canvas.width / 2, Canvas.height);

    const pixels = Canvas.context.getImageData(x - radius, y - radius, radius * 2, radius * 2).data;
    const color = new Color(r, g, b, 255);

    for (let i = 0; i < pixels.length; i += 4) {
      const pixelColor = new Color(pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
      if (color.difference(pixelColor) <= 5) {
        fitness += 1;
      }
    }
    return fitness;
  });
  GenomeEvent.on(GenomeEventType.GENOME_EVENT_POPULATION_CREATED, (chromosomes: Chromosome[]) => {
    chromosomes.map((chromosome: Chromosome) => {
      console.log(chromosome.getGenes()[0].get());
    });
  });

  GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_BEGIN, (chromosomes: Chromosome[]) => {
    const bestChromosome = chromosomes[0];
    Canvas.clear();

    chromosomes.map((chromosome: Chromosome) => {
      const genes = chromosome.getGenes();
      const constants = chromosome.getConstants();
      const x = Math.floor(constants[0].get());
      const y = Math.floor(constants[1].get());
      const radius = Math.floor(genes[0].get()) + 1;
      const r = Math.floor(genes[1].get());
      const g = Math.floor(genes[2].get());
      const b = Math.floor(genes[3].get());

      Canvas.context.beginPath();
      Canvas.context.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      Canvas.context.arc(x + Canvas.width / 2, y, radius, 0, Math.PI * 2, true);
      Canvas.context.fill();
    });
    Canvas.showImage();
    console.log(`Generation ${population.getGenerationNumber()} : ${bestChromosome.getFitness()}`);
  });

  GenomeEvent.on(GenomeEventType.GENOME_EVENT_GENERATION_FINISH, (chromosomes: Chromosome[]) => {
    const bestChromosome = chromosomes[0];

    const pixelsOriginal = Canvas.context.getImageData(0, 0, Canvas.width / 2, Canvas.height).data;
    const pixelsGenetic = Canvas.context.getImageData(Canvas.width / 2, 0, Canvas.width, Canvas.height).data;

    let sumCorrectPixels = 0;
    for (let i = 0; i < pixelsOriginal.length; i += 4) {
      const pixelOriginal = new Color(
        pixelsOriginal[i + 0],
        pixelsOriginal[i + 1],
        pixelsOriginal[i + 2],
        pixelsOriginal[i + 3],
      );
      const pixelGenetic = new Color(
        pixelsGenetic[i + 0],
        pixelsGenetic[i + 1],
        pixelsGenetic[i + 2],
        pixelsGenetic[i + 3],
      );

      if (pixelOriginal.difference(pixelGenetic) <= 5) {
        sumCorrectPixels += 1;
      }
    }

    console.log(`Percentage: ${(sumCorrectPixels * 100) / ((Canvas.width / 2) * Canvas.height)}%`);
  });

  population.run(100);
});
