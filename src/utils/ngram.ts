import { ModelBuilder, TraceModel } from "../types";

export class NGramBuilder<T> extends ModelBuilder<T> {
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
        nGrams.add(buffer.join("->"));
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
  }

  predictSingle() {}
}
