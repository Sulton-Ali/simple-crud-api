import cluster from 'node:cluster';
import * as http from 'node:http';
import { availableParallelism } from 'node:os';
import { env } from './config/env';

if (cluster.isPrimary) {
  await import('./database');
  const WORKER_COUNT = availableParallelism() - 1;

  cluster.schedulingPolicy = cluster.SCHED_RR;
  cluster.setupPrimary({
    exec: 'src/standalone',
  });

  const targets = Array.from({ length: WORKER_COUNT }, (_, i) => ({
    hostname: 'localhost',
    port: env.PORT + i + 1,
  }));
  let current = 0;

  const server = http.createServer((clientReq, clientRes) => {
    const target = targets[current];
    current = (current + 1) % targets.length;

    const options = {
      hostname: target.hostname,
      port: target.port,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };

    const proxy = http.request(options, (res) => {
      clientRes.writeHead(res.statusCode!, res.headers);
      res.pipe(clientRes, { end: true });
    });

    proxy.on('error', (err) => {
      clientRes.writeHead(502);
      clientRes.end(`Error proxying to ${target.port}`);
    });

    clientReq.pipe(proxy, { end: true });
  });

  server.listen(env.PORT, () => {
    console.log(`Load balancer running on port ${env.PORT}`);
  });

  targets.forEach((target) => {
    const envVars = {
      ...env,
      IS_MULTI: true,
      PORT: target.port,
    };

    cluster.fork(envVars);
  });

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
