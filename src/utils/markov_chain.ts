import { ModelBuilder, TraceModel } from "../types";

export type MarkovChainTable = Map<string, Map<string, number>>;

export class MarkovChainBuilder<T> extends ModelBuilder<T> {
  private transitionCounts: MarkovChainTable = new Map<
    string,
    Map<string, number>
  >();

  constructor(private readonly fn: (obj: T) => string = (obj) => String(obj)) {
    super();
  }

  async train(source: AsyncIterable<T>): Promise<void> {
    let prevState: string | null = null;
    let currentState: string | null = null;

    for await (const item of source) {
      currentState = this.fn(item);

      if (prevState && currentState) {
        if (!this.transitionCounts.has(prevState)) {
          this.transitionCounts.set(prevState, new Map());
        }
        const currentTransitions = this.transitionCounts.get(prevState)!;
        currentTransitions.set(
          currentState,
          (currentTransitions.get(currentState) || 0) + 1
        );
      }

      prevState = currentState;
    }

    // reset probability table
    this.model = {};
    for (const [currentState, transitions] of this.transitionCounts.entries()) {
      const totalTransitions = Array.from(transitions.values()).reduce(
        (sum, count) => sum + count,
        0
      );
      for (const [nextState, count] of transitions.entries()) {
        this.model[this.getTransition([currentState, nextState])] =
          count / totalTransitions;
      }
    }
  }

  predict(data: T[]): number {
    const buffer: T[] = [];
    const smoothing = 0.0001; // laplace smoothing to prevent P(0)
    let score = 0;

    for (const x of data) {
      buffer.push(x);
      if (buffer.length === 2) {
        const probability =
          this.model[this.getTransition(buffer.map((x) => this.fn(x)))] ?? 0;
        score += Math.log(probability + smoothing);
        buffer.shift();
      }
    }

    return score;
  }
}
