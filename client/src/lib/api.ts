import axios from 'axios'

export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:3001'
export const api = axios.create({ baseURL: `${API_ORIGIN}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('personal-blog-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? '请求没有成功，请稍后再试。'
  return '出现了意外问题，请稍后再试。'
}

export function coverUrl(value: string) {
  if (!value) return '/images/cover-mist.jpg'
  return value.startsWith('/uploads/') ? `${API_ORIGIN}${value}` : value
}

