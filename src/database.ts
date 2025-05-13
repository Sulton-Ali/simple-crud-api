import * as http from 'node:http';
import { handleDatabaseRouting } from './routes/database.ts';
import { env } from './config/env.ts';

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) return;

  handleDatabaseRouting(req, res);
});

server.listen(env.DB_PORT, () => {
  console.log(`Database server running at http://localhost:${env.DB_PORT}`);
});
