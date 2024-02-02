import { Config, API } from 'src/core';

import { PostResource } from './post.ts';
import { UserResource } from './user.ts';
import { Test } from './nonResource.ts';

const config = new Config({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const api = new API(config)
  .addResource('posts', PostResource)
  .addResource('users', UserResource)
  .addResource('test', Test);

api.interceptors.request.use(
  (config) => {
    console.log('Request Interceptor', config);
    return config;
  },
  (error) => {
    console.log('Request Error Interceptor', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor', response);
    return response;
  },
  (error) => {
    console.log('Response Error Interceptor', error);
    return Promise.reject(error);
  },
);

api
  .setConfig({
    baseURL: 'https://api.github.com',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  })
  .get('/users/antonybudianto')
  .then((res) => {
    console.log(res.data);
  });
