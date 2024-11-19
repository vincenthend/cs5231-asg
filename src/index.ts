import path from "node:path";
import { SyscallData } from "./types";
import { SyscallLogParser } from "./utils/parser";
import { MarkovChainBuilder } from "./utils/markov_chain";
import { ExecutionScanner } from "./utils/scanner";
import { NGramBuilder } from "./utils/ngram";

const DATASETS = [path.resolve(__dirname, "../log/log.txt")];
const TEST_LOG = path.resolve(__dirname, "../test_data/malicious_log.txt");

const N_GRAM = 3;
const MODEL = new NGramBuilder<SyscallData>(
  N_GRAM,
  (data: SyscallData) => data.syscall
);

// const MODEL = new MarkovChainBuilder<SyscallData>(
//   (data: SyscallData) => data.syscall
// );

async function main() {
  // Train data
  for await (const dataset of DATASETS) {
    const parser = new SyscallLogParser(dataset);
    await MODEL.train(parser.getNextStatement());
  }

  const detector = new ExecutionScanner(5);
  const score = await detector.predictScore(MODEL, TEST_LOG);

  console.log(MODEL.getModel());
  console.log("\n\n\n\n");
  console.log(score);
}

main();
