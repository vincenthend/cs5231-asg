export interface SyscallData {
  syscall: string;
  parameters: string[];
  return_value: string;
}

export type TraceModel = Record<string, number>;

export abstract class ModelBuilder<T> {
  protected model: TraceModel = {};

  abstract train(iter: AsyncIterable<T>): Promise<void>;
  getModel(): TraceModel {
    return this.model;
  }
}
