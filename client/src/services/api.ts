import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  signup: (data: { name: string; email: string; password: string; userType: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () =>
    api.get('/auth/profile'),
}

export const propertyService = {
  getAll: (params?: any) =>
    api.get('/properties', { params }),
  getById: (id: string) =>
    api.get(`/properties/${id}`),
  create: (data: any) =>
    api.post('/properties', data),
  update: (id: string, data: any) =>
    api.patch(`/properties/${id}`, data),
  delete: (id: string) =>
    api.delete(`/properties/${id}`),
  search: (filters: any) =>
    api.get('/properties', { params: filters }),
}

export default api
