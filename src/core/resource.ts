import { AxiosRequestConfig } from 'axios';

import { API } from './api';
import { Config } from './config';

export class Resource<
  TData = unknown,
  TPayload = unknown,
  TParams = unknown,
  TDatas = TData[],
> {
  url: string | undefined;
  api: API;
  private _config: Config;

  constructor(api: API) {
    this.api = api;
    this._config = api.getConfig();
  }

  set config(config: Config) {
    this._config = config;
    this.api = this.api.setConfig(config.getValue());
  }

  get config(): Config {
    return this._config;
  }

  setConfig(
    this,
    config:
      | AxiosRequestConfig
      | ((config: AxiosRequestConfig) => AxiosRequestConfig),
  ) {
    const newConfig = new Config(
      typeof config === 'function' ? config(this._config.getValue()) : config,
    );

    const newApi = this.api.setConfig(newConfig.getValue());

    return new this.constructor(newApi);
  }

  getConfig(): Config {
    return this._config;
  }

  assertUrl(url: string | undefined): asserts url is string {
    if (!url) {
      throw new Error('Endpoint URL is required');
    }
  }

  getURL(): string {
    this.assertUrl(this.url);
    return this.url;
  }

  all(params?: TParams, config?: AxiosRequestConfig) {
    this.assertUrl(this.url);
    return this.api.get<TDatas, TParams>(this.url, params, config);
  }

  getById(id: string | number, params?: TParams, config?: AxiosRequestConfig) {
    this.assertUrl(this.url);
    return this.api.get<TData, TParams>(`${this.url}/${id}`, params, config);
  }

  create(payload: TPayload, config?: AxiosRequestConfig) {
    this.assertUrl(this.url);
    return this.api.post<TData, TPayload>(this.url, payload, config);
  }

  update(id: string, payload: TPayload, config?: AxiosRequestConfig) {
    this.assertUrl(this.url);
    return this.api.put<TData, TPayload>(`${this.url}/${id}`, payload, config);
  }

  delete(id: string, payload?: TPayload, config?: AxiosRequestConfig) {
    this.assertUrl(this.url);
    return this.api.delete<TData, TPayload>(
      `${this.url}/${id}`,
      payload,
      config,
    );
  }

  static isResource = true;
}
