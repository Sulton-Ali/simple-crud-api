import type { User } from '../model/user';

export class DatabaseService {
  #users: User[] = [
    {
      id: '1',
      username: 'Sultonali',
      age: 32,
      hobbies: [],
    },
  ];

  findUsers() {
    return this.#users;
  }

  createUser(record: User) {
    this.#users.push(record);
    return record;
  }

  updateUser(id: string, { id: _bodyId, ...record }: User) {
    const index = this.#users.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.#users[index] = Object.assign(this.#users[index], record);
      return { ...this.#users[index] };
    } else {
      return null;
    }
  }
}
