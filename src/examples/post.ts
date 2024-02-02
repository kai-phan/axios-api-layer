import { API, Resource } from 'src/core';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type SearchParams = {
  _page?: number;
  _limit?: number;
};

export class PostResource extends Resource<Post, Partial<Post>, SearchParams> {
  constructor(api: API) {
    super(api);
    this.url = '/posts';
  }
}
