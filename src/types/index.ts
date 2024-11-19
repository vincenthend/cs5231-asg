export interface SyscallData {
  syscall: string;
  parameters: string[];
  return_value: string;
}

export type TraceModel = Record<string, number>;

export abstract class ModelBuilder<T> {
  protected model: TraceModel = {};

  getModel(): TraceModel {
    return this.model;
  }

  protected getTransition(buffer: string[]) {
    return buffer.join("->");
  }

  abstract train(iter: AsyncIterable<T>): Promise<void>;

  abstract predict(data: T[]): number;
}
