import type { IncomingMessage, ServerResponse } from 'node:http';
import { DatabaseController } from '../handlers/database.ts';
import { DatabaseService } from '../services/database.ts';
import { sendJson } from '../lib/send.ts';
import { match } from '../lib/match.ts';

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

const databaseController = new DatabaseController(new DatabaseService());

export async function handleDatabaseRouting(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
    const params = match('/users/:id', pathname);

    if (/^\/users(?:\/.*)?$/.test(pathname)) {
      const method = req.method?.toUpperCase();
      switch (method) {
        case 'GET': {
          params?.id
            ? databaseController.getUserById(req, res)
            : databaseController.getUserList(res);
          break;
        }
        case 'POST': {
          await databaseController.createUser(req, res);
          break;
        }
        case 'PUT': {
          databaseController.updateUser(req, res);
          break;
        }
        case 'DELETE': {
          databaseController.deleteUser(req, res);
          break;
        }
        default: {
          sendJson(res, 404, {
            message: 'Requested url does not exist',
          });
          break;
        }
      }
    } else {
      sendJson(res, 404, {
        message: 'Requested url does not exist',
      });
    }
  } catch (e) {
    sendJson(res, 500, {
      message: 'Internal Server Error',
      error: e,
    });
  }
}
