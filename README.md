# API repository example
The goal is to create an api object that can be used to interact with the API using OOP principles. Feel like AWC API gateway.
- Can quickly change the base url to use the api object with different api url.
- Allow each request can modify config like the timeout, headers, etc.
- Support authentication and permissions.
- Allow adding new endpoints to the api object.
- Typescript support.

## Usage
### API object
```typescript
import { Api } from 'api';
import { AxiosRequestConfig } from 'axios';

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

const api = new API(config);

api.get('/posts').then((response) => {
    console.log(response.data);
});

```
### Resource object

```typescript
import {Api} from 'api';
import {AxiosRequestConfig} from 'axios';
import {Resource} from "./resource";
import {Post} from "./post";

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

class PostResource extends Resource<Post, Partial<Post>, SearchParams, Post[]> {
    constructor(api: Api) {
        super(api);
        this.url = '/posts';
    }
}

const api = new API(config)
    .addResource('posts', PostResource)
    .addResource('users', UserResource);

// Get all posts
api.posts.all().then((response) => {
    console.log(response.data);
});

// Get post with id 1
api.posts.getById(1).then((response) => {
    console.log(response.data);
});

// Create a new post
api.posts.create({
    title: 'foo',
    body: 'bar',
    userId: 1,
}).then((response) => {
    console.log(response.data);
});

// Update post with id 1
api.posts.update(1, {
    title: 'foo',
    body: 'bar',
    userId: 1,
}).then((response) => {
    console.log(response.data);
});

// Delete post with id 1
api.posts.delete(1).then((response) => {
    console.log(response.data);
});
```
### Resource custom method

```typescript
import {Resource} from "./resource";
import {AxiosResponse} from "axios";

type User = {
    id: string
    name: string;
}

class UserResource extends Resource {
    constructor(api: Api) {
        super(api);
        this.url = '/users';
    }

    // Custom method
    getByName(name: string): Promise<AxiosResponse<User>> {
        return this.api.get(`${this.url}/name/${name}`);
    }
    
    // Override method
    override all(): Promise<AxiosResponse<User[]>> {
        return this.api.get(`${this.url}/all`);
    }
}

const api = new API(config)
    .addResource('users', UserResource);

// Get user by name
api.users.getByName('foo').then((response) => {
    console.log(response.data);
});

// Get all users
api.users.all().then((response) => {
    console.log(response.data);
});
```
### Config object
```typescript
import {Config} from 'api';

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

config.set('baseURL', 'https://api.example.com');
config.set('headers', {
    'Content-Type': 'application/json',
});

config.get('baseURL'); // https://api.example.com
config.getValue(); // { baseURL: 'https://api.example.com', headers: { 'Content-Type': 'application/json' } }
```

### Config for api object

```typescript
import {Config} from "./config";

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Modify config at global level
api.config = new Config({
    baseURL: 'https://api.github.com',
});

// This will using the new config, GET https://api.github.com/users
api.get('/users').then((res) => {
    console.log(res.data);
});

// This one too, GET https://api.github.com/users
api.users.all().then((res) => {
    console.log(res.data);
});

// Modify config at request level

// This will use the config itself, GET https://jsonplaceholder.typicode.com/users
api.setConfig({
    baseURL: 'https://jsonplaceholder.typicode.com',
}).get('/users').then((res) => {
    console.log(res.data);
});
```

### Config for resource object

```typescript
import {Config} from "./config";

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

/* Modify config at global level */
api.config = new Config({
    baseURL: 'https://api.github.com',
});

// This will using the new config above, GET https://api.github.com/users
api.users.all().then((res) => {
    console.log(res.data);
});

/* Modify config at resource level */
api.users.config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
});

// This one will use the config above, GET https://jsonplaceholder.typicode.com/users
api.users.all().then((res) => {
    console.log(res.data);
});

// These requests won't be effected, still using the global config, GET https://api.github.com/posts
api.posts.all().then((res) => {
    console.log(res.data);
});

api.get('/posts').then((res) => {
    console.log(res.data);
});

/* Modify config at request level */
// This will using the new config itself, GET http://localhost:3000/posts
api.users
    .setConfig({})
    .all()
    .then((res) => {
        console.log(res.data);
    });

```

### Non resource class

```typescript
import {Api} from 'api';

class User {
    // Constructor is required
    constructor(private api: Api) {
        this.url = '/users';
    }
    
    // Custom method
    getByName(name: string): Promise<AxiosResponse<User>> {
        return this.api.get(`${this.url}/name/${name}`);
    }
}

const api = new API(config)
    .addResource('users', User)
    .getByName('foo').then((response) => {
        console.log(response.data);
    });

```

### Interceptors

```typescript
import {Api} from 'api';

const config = new Config({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

const api = new API(config);

// Add a request interceptor at global level
api.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor at global level
api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);
```