import { randomUUID } from 'node:crypto';
import type { User } from '../model/user';
import { env } from '../config/env';

export class UserService {
  #url: string = '';

  constructor() {
    this.#url = `http://localhost:${env.DB_PORT}/users`;
  }

  async getUserList() {
    return fetch(this.#url, { method: 'GET' });
  }

  async getUser(id: string) {
    return fetch(`${this.#url}/${id}`, { method: 'GET' });
  }

  async createUser(user: Omit<User, 'id'>) {
    const record: User = { ...user, id: randomUUID() };
    return fetch(this.#url, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateUser(id: string, user: Omit<User, 'id'>) {
    const record: User = { ...user, id };
    return fetch(`${this.#url}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  }

  async deleteUser(id: string) {
    return fetch(`${this.#url}/${id}`, { method: 'DELETE' });
  }
}
