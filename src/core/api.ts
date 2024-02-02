import axios, {
  Axios,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { Config } from './config.ts';
import { Resource } from './resource.ts';

export class API {
  private _instance: AxiosInstance;
  private _config: Config;
  interceptors: Axios['interceptors'];

  constructor(
    config: Config = new Config(),
    interceptors?: Axios['interceptors'],
  ) {
    this._config = config;
    this._instance = axios.create(config.getValue());

    this.interceptors = this._instance.interceptors =
      interceptors || this._instance.interceptors;
  }

  set config(config: Config) {
    this._config = config;
    this._instance = axios.create(config.getValue());
  }

  get config(): Config {
    return this._config;
  }

  setConfig(
    config:
      | AxiosRequestConfig
      | ((config: AxiosRequestConfig) => AxiosRequestConfig),
  ) {
    const newConfig = new Config(
      typeof config === 'function' ? config(this.config.getValue()) : config,
    );
    return new API(newConfig, this.interceptors);
  }

  getConfig(): Config {
    return this.config;
  }

  get<TData = unknown, TParams = unknown>(
    url: string = '/',
    params: TParams = {} as TParams,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TData>> {
    console.log(this._instance.interceptors);
    return this._instance.get(url, {
      params,
      ...config,
    });
  }

  post<TData = unknown, TPayload = unknown>(
    url: string = '/',
    payload: TPayload = {} as TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TData>> {
    return this._instance.post(url, payload, {
      ...config,
    });
  }

  put<TData = unknown, TPayload = unknown>(
    url: string = '/',
    payload: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TData>> {
    return this._instance.put(url, payload, {
      ...config,
    });
  }

  patch<TData = unknown, TPayload = unknown>(
    url: string = '/',
    payload?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TData>> {
    return this._instance.patch(url, payload, {
      ...config,
    });
  }

  delete<TData = unknown, TPayload = unknown>(
    url: string = '/',
    payload?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TData>> {
    return this._instance.delete(url, {
      ...config,
      data: payload,
    });
  }

  addResource<
    Key extends PropertyKey,
    R extends typeof Resource<unknown, unknown, unknown, unknown>,
  >(name: Key, resource: R): this & Record<Key, InstanceType<R>>;

  addResource<Key extends PropertyKey, R extends NonResourceClass>(
    name: Key,
    resource: R,
  ): this & Record<Key, InstanceType<R>>;

  addResource(name: any, resource: any) {
    Object.defineProperty(this, name, {
      value: new resource(this),
      writable: false,
    });

    return this;
  }
}

type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;
type NonResourceClass = new (api: API) => unknown;
