import type { IncomingMessage } from 'http';
import { match } from './match';

export function getParams(req: IncomingMessage, pattern: string) {
  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  const params = match(pattern, pathname);
  return params;
}
