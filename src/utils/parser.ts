import fs from "node:fs";
import readline from "node:readline";
import { SyscallData } from "../types";

export class SyscallLogParser {
  private stream: fs.ReadStream;
  private rl: readline.Interface;
  private static LOG_PATTERN =
    /^\s*\[(?<sequence>\d+)\]\s+(?<syscall>[a-z_]+)\((?<params>[^\)]+)\)\s=\s(?<result>.+)$/;

  constructor(private readonly filePath: string) {
    this.stream = fs.createReadStream(filePath);
    this.rl = readline.createInterface({
      input: this.stream,
      crlfDelay: Infinity,
    });
  }

  private parseLogLine(line: string): SyscallData | null {
    // [25773]    brk(0x0) = 0x7f02b83c7000
    const match = SyscallLogParser.LOG_PATTERN.exec(line);

    if (!match) return null;

    const syscall = match.groups!.syscall;
    const params = match.groups!.params.split(",").map((x) => x.trim());
    const return_value = match.groups!.result;

    return {
      syscall,
      parameters: params,
      return_value: return_value,
    };
  }

  async *getNextStatement(): AsyncGenerator<SyscallData> {
    for await (const line of this.rl) {
      const data = this.parseLogLine(line);
      if (data) {
        yield data;
      }
    }
  }

  close() {
    this.rl.close();
    this.stream.close();
  }
}
