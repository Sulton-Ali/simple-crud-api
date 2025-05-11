import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import * as process from 'node:process';
import { env } from './config/env';

import './database';

const processCount = availableParallelism() - 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running on port ${env.PORT}`);

  cluster.schedulingPolicy = cluster.SCHED_RR;
  cluster.setupPrimary({
    exec:
      env.NODE_ENV !== 'production'
        ? 'src/standalone.ts'
        : 'build/standalone.bundle.js',
  });

  // Fork workers.
  for (let i = 0; i < processCount; i++) {
    cluster.fork({
      ...env,
      IS_MULTI: true,
      PORT: env.PORT + i + 1,
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
