import { Promise } from 'bluebird';

class Canvas {
  public readonly width: number;
  public readonly height: number;
  private canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }

  init(imageURI: string) {
    return new Promise(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        this.image = image;
        this.context.drawImage(image, 0, 0, this.width / 2, this.height);
        resolve();
      });
      image.src = imageURI;
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
    if (this.image) {
      this.context.drawImage(this.image, 0, 0, this.width / 2, this.height);
    }
  }

  showImage() {
    if (this.image) {
      this.context.drawImage(this.image, 0, 0, this.width / 2, this.height);
    }
  }
}

export default new Canvas(1000, 1000);
