import { StringDecoder } from 'node:string_decoder';
import type { IncomingMessage } from 'node:http';

export default function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const dec = new StringDecoder('utf8');
    let buf = '';
    req.on('data', (chunk) => (buf += dec.write(chunk)));
    req.on('end', () => {
      buf += dec.end();
      try {
        resolve(buf ? JSON.parse(buf) : null);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}
