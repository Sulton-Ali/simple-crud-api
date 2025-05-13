import type { ServerResponse } from 'http';

export function sendJson(res: ServerResponse, status: number, data?: unknown) {
  const body = data ? JSON.stringify(data) : null;
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': body ? Buffer.byteLength(body) : 0,
  });
  res.end(body);
}
