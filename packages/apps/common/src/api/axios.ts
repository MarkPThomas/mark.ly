import axios from 'axios';

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