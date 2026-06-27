import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse, ApiResponse } from '@/types'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('wealthos_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('wealthos_token')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default api