import type { User } from '../model/user';

export class DatabaseService {
  #users: User[] = [];

  findUsers() {
    return this.#users;
  }

  findUser(id: string) {
    return this.#users.find((item) => item.id === id);
  }

  createUser(record: User) {
    this.#users.push(record);
    return record;
  }

  updateUser(id: string, record: Omit<User, 'id'>) {
    const index = this.#users.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.#users[index] = Object.assign(this.#users[index], record);
      return { ...this.#users[index] };
    } else {
      return null;
    }
  }

  deleteUser(id: string) {
    const index = this.#users.findIndex((item) => item.id === id);

    if (index !== -1) {
      const user = { ...this.#users[index] };
      this.#users = this.#users.splice(index, 1);
      return user;
    } else {
      return null;
    }
  }
}
