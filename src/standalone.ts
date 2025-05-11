import * as http from 'node:http';
import { handleUserRouting } from './routes/user.ts';
import { env } from './config/env.ts';

if (!env.IS_MULTI) {
  await import('./database');
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) return;
  handleUserRouting(req, res);
});

server.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
