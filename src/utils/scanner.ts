import { ModelBuilder, SyscallData, TraceModel } from "../types";
import { SyscallLogParser } from "./parser";

export class ExecutionScanner {
  constructor(private n: number = 10) {}

  async predictScore(model: ModelBuilder<SyscallData>, logPath: string) {
    const reader = new SyscallLogParser(logPath);
    const regularityScore = [];

    let logs: SyscallData[] = [];
    // sliding window
    for await (const logEntry of reader.getNextStatement()) {
      logs.push(logEntry);

      if (logs.length === this.n) {
        regularityScore.push(model.predict(logs));
        logs.shift();
      }
    }

    return regularityScore;
  }
}
