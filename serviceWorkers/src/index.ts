import { CONFIG } from "./config.js";
import { processAssignmentQueue } from "./workers/assignment.js";
import { processFundingQueue } from "./workers/funding.js";

interface WorkerTask {
  name: string;
  interval: number;
  handler: () => Promise<void>;
}

const tasks: WorkerTask[] = [];

export function registerTask(task: WorkerTask): void {
  tasks.push(task);
  console.log(`Registered task: ${task.name} (interval: ${task.interval}ms)`);
}

export function startWorkers(): void {
  console.log(`Starting ${tasks.length} service worker(s)...`);

  for (const task of tasks) {
    // Run immediately on start, then on interval
    task.handler().catch((err) =>
      console.error(`Task "${task.name}" initial run failed:`, err),
    );

    setInterval(async () => {
      try {
        await task.handler();
      } catch (err) {
        console.error(`Task "${task.name}" failed:`, err);
      }
    }, task.interval);
  }
}

// Register workers
registerTask({
  name: "wallet-assignment",
  interval: CONFIG.assignmentPollInterval,
  handler: processAssignmentQueue,
});

registerTask({
  name: "wallet-funding",
  interval: CONFIG.fundingPollInterval,
  handler: processFundingQueue,
});

startWorkers();
