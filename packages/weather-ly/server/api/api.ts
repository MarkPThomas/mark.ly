import axios, { AxiosResponse } from 'axios';

// Source: https://www.weather.gov/documentation/services-web-api\
const instance = axios.create({
  baseURL: `https://api.weather.gov/`
});
const responseBody = (response: AxiosResponse) => response.data;

export const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};