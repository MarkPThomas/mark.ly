import axios, { AxiosResponse } from 'axios';

// Source: https://www.weather.gov/documentation/services-web-api\
const instance = axios.create({
  baseURL: `https://api.weather.gov/`
});
const responseBody = (response: AxiosResponse) => response.data;

export class Requests {
  static async get<TResult>(url: string): Promise<TResult> {
    return instance.get<TResult>(url).then(responseBody);
  }
  static async post<TResult, TBody>(url: string, body: TBody): Promise<TResult> {
    return instance.post<TResult>(url, body).then(responseBody);
  }
  static async put<TResult, TBody>(url: string, body: TBody): Promise<TResult> {
    return instance.put<TResult>(url, body).then(responseBody);
  }
  static async delete<TResult>(url: string): Promise<TResult> {
    return instance.delete<TResult>(url).then(responseBody);
  }
}

export const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};