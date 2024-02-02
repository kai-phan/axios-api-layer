import { AxiosRequestConfig } from 'axios';

export class Config {
  constructor(private value: AxiosRequestConfig = {}) {
    this.value = value;
  }

  set(key: keyof AxiosRequestConfig, value: string): void {
    this.value[key] = value;
  }

  get(key: keyof AxiosRequestConfig): string {
    return this.value[key];
  }

  getValue(): AxiosRequestConfig {
    return this.value;
  }

  setHeaders(key: string, value: string): void {
    this.value.headers = {
      ...this.value.headers,
      [key]: value,
    };
  }
}
