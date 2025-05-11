import { UserController } from '../handlers/user.ts';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { UserService } from '../services/user.ts';
import { match } from '../lib/match.ts';
import { sendJson } from '../lib/send.ts';

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

const userController = new UserController(new UserService());

export async function handleUserRouting(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
    const params = match('/api/users/:id', pathname);

    console.log('[User] ', pathname);
    console.log('[User] ', params);

    if (/^\/api\/users(?:\/.*)?$/.test(pathname)) {
      const method = req.method?.toUpperCase();
      switch (method) {
        case 'GET': {
          params?.id
            ? userController.getUserById(res, params.id)
            : userController.getUserList(res);
          break;
        }
        // case 'POST': {
        //   await userController.createUser(req, res);
        //   break;
        // }
        // case 'PUT': {
        //   userController.updateUser(req, res);
        //   break;
        // }
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
    console.log('[User] ', e);

    sendJson(res, 500, {
      message: 'Internal Server Error',
      error: e,
    });
  }
}
