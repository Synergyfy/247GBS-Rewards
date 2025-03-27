import axios from 'axios';

export const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setBearerToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
