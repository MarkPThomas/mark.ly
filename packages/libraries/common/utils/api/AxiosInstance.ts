import axios, { AxiosResponse } from "axios";

export interface IAxiosInstance {
  get<TResult>(url: string): Promise<TResult>;
  post<TResult, TBody>(url: string, body: TBody): Promise<TResult>;
  put<TResult, TBody>(url: string, body: TBody): Promise<TResult>;
  delete<TResult>(url: string): Promise<TResult>;
}

export const createAxiosInstance = (baseUrl: string = ''): IAxiosInstance => {
  const responseBody = (response: AxiosResponse) => response.data;

  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: { 'Access-Control-Allow-Origin': '*', }
  });

  return {
    async get<TResult>(url: string): Promise<TResult> {
      console.log('get url: ', url);
      // console.log('AXIOS: ', instance.options.)
      return instance.get<TResult>(url).then(responseBody);
    },
    async post<TResult, TBody>(url: string, body: TBody): Promise<TResult> {
      return instance.post<TResult>(url, body).then(responseBody);
    },
    async put<TResult, TBody>(url: string, body: TBody): Promise<TResult> {
      return instance.put<TResult>(url, body).then(responseBody);
    },
    async delete<TResult>(url: string): Promise<TResult> {
      return instance.delete<TResult>(url).then(responseBody);
    }
  };
}