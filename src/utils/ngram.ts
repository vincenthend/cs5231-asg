import { ModelBuilder, TraceModel } from "../types";

export class NGramBuilder<T> extends ModelBuilder<T> {
  private dataCount = 0;

  constructor(
    private readonly n: number,
    private readonly fn: (obj: T) => string = (obj) => String(obj)
  ) {
    super();
  }

  async train(source: AsyncIterable<T>): Promise<void> {
    const nGrams: Set<string> = new Set();
    const buffer: string[] = [];

    for await (const item of source) {
      buffer.push(this.fn(item));

      if (buffer.length === this.n) {
        nGrams.add(this.getTransition(buffer));
        buffer.shift(); // Remove the first item to slide the window
      }
    }

    for (const ngram of nGrams.values()) {
      if (this.model[ngram]) {
        this.model[ngram] += 1;
      } else {
        this.model[ngram] = 1;
      }
    }

    this.dataCount += 1;
  }

  getModel(): TraceModel {
    return Object.entries(this.model).reduce(
      (prev, [key, value]) => ({ ...prev, [key]: value / this.dataCount }),
      {}
    );
  }

  predict(data: T[]): number {
    const buffer: T[] = [];
    let abnormality = 0;
    const smoothing = 0.0001; // laplace smoothing to prevent P(0)

    for (const x of data) {
      buffer.push(x);
      if (buffer.length === this.n) {
        const probability =
          this.model[this.getTransition(buffer.map((x) => this.fn(x)))] ?? 0;

        abnormality += Math.log(probability + smoothing);
        buffer.shift();
      }
    }

    return abnormality;
  }
}
