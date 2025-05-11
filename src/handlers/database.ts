import type { IncomingMessage, ServerResponse } from 'node:http';
import { DatabaseService } from '../services/database';
import { sendJson } from '../lib/send';
import readBody from '../lib/readBody';
import type { User } from '../model/user';

export class DatabaseController {
  #databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.#databaseService = databaseService;
  }

  getUserList(res: ServerResponse) {
    const users = this.#databaseService.findUsers();
    sendJson(res, 200, users);
  }

  getUserById(res: ServerResponse, id: string) {
    const users = this.#databaseService.findUsers();
    sendJson(res, 200, users);
  }

  async createUser(req: IncomingMessage, res: ServerResponse) {
    const body = await readBody(req);
    const createdUser = this.#databaseService.createUser(body as User);
    sendJson(res, 201, createdUser);
  }

  async updateUser(req: IncomingMessage, res: ServerResponse) {
    const body = await readBody(req);
  }
}
