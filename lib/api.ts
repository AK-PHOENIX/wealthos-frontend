import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Helper to recursively convert camelCase keys to snake_case keys
export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  } else if (obj !== null && obj !== undefined && typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof File)) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Helper to recursively convert snake_case keys to camelCase keys
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj !== null && obj !== undefined && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      );
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('wealthos_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Convert payload data
  if (config.data && !(config.data instanceof FormData)) {
    config.data = camelToSnake(config.data)
  }

  // Convert URL parameters
  if (config.params) {
    config.params = camelToSnake(config.params)
  }

  return config
})

api.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data) {
      res.data = snakeToCamel(res.data)
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wealthos_token')
      // Only redirect to login if we are not already on login or signup pages
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && window.location.pathname !== '/') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api