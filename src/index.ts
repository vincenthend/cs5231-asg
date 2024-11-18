import path from "node:path";
import { SyscallData } from "./types";
import { SyscallLogParser } from "./utils/parser";
import { MarkovChainBuilder } from "./utils/markov_chain";

const DATASETS = [path.resolve(__dirname, "../log/log.txt")];

// const N_GRAM = 3;
// const MODEL = new NGramBuilder<SyscallData>(
//   N_GRAM,
//   (data: SyscallData) => data.syscall
// );

const MODEL = new MarkovChainBuilder<SyscallData>(
  (data: SyscallData) => data.syscall
);

async function main() {
  for await (const dataset of DATASETS) {
    const parser = new SyscallLogParser(dataset);
    await MODEL.train(parser.getNextStatement());
  }

  console.log(MODEL.getModel());
}

main();
