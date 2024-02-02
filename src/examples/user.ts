import { API, Resource } from 'src/core';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type SearchParams = {
  _page?: number;
  _limit?: number;
};

export class UserResource extends Resource<User, Partial<User>, SearchParams> {
  constructor(api: API) {
    super(api);
    this.url = '/users';
  }

  getByName(name: string) {
    return this.api.get<User>(`${this.url}/${name}`);
  }
}
