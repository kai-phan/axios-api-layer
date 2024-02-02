import { API } from 'src/core';

export class Test {
  url: string;
  constructor(private api: API) {
    this.url = 'test';
    this.api = api;
  }

  getABC() {
    return this.api.get(this.url);
  }
}
