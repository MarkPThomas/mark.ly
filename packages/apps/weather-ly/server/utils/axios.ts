import axios, { AxiosResponse } from 'axios';

export const applyAxiosErrorHandler = (): void => {
  axios.interceptors.response.use(undefined, error => {
    const { method, url } = error.config;

    if (error.response) {
      const response = error.response;
      const statusCode = response.status;

      error.message = `${error.message}; URL: ${url}; status: ${statusCode}; method: ${method}; data: ${response.data}`;
    } else if (error.request) {
      const errorCode = error.code;

      error.message = `${error.message}; URL: ${url}; method: ${method}; code: ${errorCode}`;
    }

    return Promise.reject(error);
  });
};

export interface axiosInstance {
  get<TResult>(url: string): Promise<TResult>;
  post<TResult, TBody>(url: string, body: TBody): Promise<TResult>;
  put<TResult, TBody>(url: string, body: TBody): Promise<TResult>;
  delete<TResult>(url: string): Promise<TResult>;
}

export const createAxiosInstance = (baseUrl: string = '') => {
  const responseBody = (response: AxiosResponse) => response.data;

  const instance = axios.create({
    baseURL: baseUrl
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
  } as axiosInstance;

  // export const requests = {
  //   get: (url: string) => instance.get(url).then(responseBody),
  //   post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  //   put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  //   delete: (url: string) => instance.delete(url).then(responseBody),
  // };
}