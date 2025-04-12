import type { IncomingMessage, ServerResponse } from 'node:http';
import { UserService } from '../services/user';
import { sendJson } from '../lib/send';
import readBody from '../lib/readBody';
import { getParams } from '../lib/getParams';
import type { User } from '../model/user';

export class UserController {
  #userService: UserService;
  constructor(userService: UserService) {
    this.#userService = userService;
  }

  async getUserList(res: ServerResponse) {
    console.log('[User]: ', 'called method getUserList');

    const response = await this.#userService.getUserList();
    const users = await response.json();
    console.log('[User]: Result from database', users);

    sendJson(res, 200, users);
  }

  async getUserById(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/api/users/:id');
    console.log('[User]: ', 'called method getUserById with id ' + params?.id);
    if (!params?.id) {
      sendJson(res, 400, {
        message: 'User id not passed',
      });
      return;
    }
    const response = await this.#userService.getUser(params?.id);
    const user = await response.json();
    sendJson(res, 200, user);
  }

  async createUser(req: IncomingMessage, res: ServerResponse) {
    const body = await readBody(req);
    console.log('[User]: ', 'called method createUser with body ', body);
    const response = await this.#userService.createUser(body as User);
    const createdUser = await response.json();
    sendJson(res, 201, createdUser);
  }

  async updateUser(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/api/users/:id');
    console.log('[User]: ', 'called method updateUser with id ', params?.id);

    if (!params?.id) {
      sendJson(res, 400, {
        message: 'User id not passed',
      });
      return;
    }
    const body = await readBody(req);
    console.log('[User]: ', 'called method updateUser with body ', body);
    const response = await this.#userService.updateUser(
      params?.id,
      body as User,
    );
    const updatedUser = await response.json();

    if (!updatedUser) {
      sendJson(res, 404, {
        message: `User with id ${params.id} does not exist`,
      });
    } else {
      sendJson(res, 200, updatedUser);
    }
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/api/users/:id');
    console.log('[User]: ', 'called method deleteUser with id ', params?.id);
    if (!params?.id) {
      sendJson(res, 400, {
        message: 'User id not passed',
      });
      return;
    }

    const response = await this.#userService.deleteUser(params.id);
    const deletedUser = await response.json();

    if (!deletedUser) {
      sendJson(res, 404, {
        message: `User with id ${params.id} does not exist`,
      });
    } else {
      sendJson(res, 204);
    }
  }
}
