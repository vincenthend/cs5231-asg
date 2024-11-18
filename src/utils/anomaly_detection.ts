import { read } from "fs";
import { ModelBuilder, SyscallData, TraceModel } from "../types";
import { SyscallLogParser } from "./parser";

const N = 10

class AnomalyDetector {
    constructor(private n: number = 10) {}

    detect(model: ModelBuilder, logPath: string) {
        z
    }

}

function detectAnomaly(model: TraceModel, logPath: string, compareFunction: (model: TraceModel, log: SyscallData[])) {
    const reader = new SyscallLogParser(logPath);
    
    let logs: SyscallData[] = [];
    for await (const logEntry of reader.getNextStatement()) {
        logs.push(logEntry);

        if (logs.length === N) {
            const anomalyScore = compareFunction(model, logs);
            logs = [];
        }
    }

    if (logs.length > 0) {
        compareFunction(model, logs);
    }
}