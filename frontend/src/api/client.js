import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)));
  }
);

export default client;
