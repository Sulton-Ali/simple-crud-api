import type { IncomingMessage, ServerResponse } from 'node:http';
import { DatabaseService } from '../services/database';
import { sendJson } from '../lib/send';
import readBody from '../lib/readBody';
import type { User } from '../model/user';
import { getParams } from '../lib/getParams';

export class DatabaseController {
  #databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.#databaseService = databaseService;
  }

  getUserList(res: ServerResponse) {
    const users = this.#databaseService.findUsers();

    sendJson(res, 200, users);
  }

  getUserById(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/users/:id');
    const users = this.#databaseService.findUser(params?.id ?? '');
    sendJson(res, 200, users);
  }

  async createUser(req: IncomingMessage, res: ServerResponse) {
    const body = await readBody(req);
    const createdUser = this.#databaseService.createUser(body as User);
    sendJson(res, 200, createdUser);
  }

  async updateUser(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/users/:id');
    const body = await readBody(req);
    const updatedUser = this.#databaseService.updateUser(
      params?.id ?? '',
      body as User,
    );

    sendJson(res, 200, updatedUser);
  }

  deleteUser(req: IncomingMessage, res: ServerResponse) {
    const params = getParams(req, '/users/:id');
    const deletedUser = this.#databaseService.deleteUser(params?.id ?? '');
    sendJson(res, 200, deletedUser);
  }
}
