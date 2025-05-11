import { randomUUID } from 'node:crypto';
import type { User } from '../model/user';
import { env } from '../config/env';

export class UserService {
  #url: string = '';

  constructor() {
    this.#url = `http://localhost:${env.DB_PORT}/users`;
  }

  async getUserList(): Promise<User[]> {
    const response = await fetch(this.#url, { method: 'GET' });
    const users = await response.json();

    return users as unknown as User[];
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const record: User = { ...user, id: randomUUID() };
    const response = await fetch(this.#url, {
      method: 'POST',
      body: JSON.stringify(record),
    });
    const result = await response.json();
    return result as unknown as User;
  }

  async updateUser(id: string, user: Omit<User, 'id'>): Promise<User> {
    const record: User = { ...user, id };
    const response = await fetch(this.#url, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
    const result = await response.json();
    return result as unknown as User;
  }

  getUser(id: string): User | undefined {
    return;
  }
}
