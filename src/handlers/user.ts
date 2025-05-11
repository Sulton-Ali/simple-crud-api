import type { ServerResponse } from 'node:http';
import { UserService } from '../services/user';
import { sendJson } from '../lib/send';

export class UserController {
  #userService: UserService;
  constructor(userService: UserService) {
    this.#userService = userService;
  }

  async getUserList(res: ServerResponse) {
    const users = await this.#userService.getUserList();
    sendJson(res, 200, users);
  }

  async getUserById(res: ServerResponse, id: string) {
    const users = await this.#userService.getUserList();
    sendJson(res, 200, users);
  }
}
