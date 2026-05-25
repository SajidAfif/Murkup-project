import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`

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
  verify: (formData: FormData) =>
    api.post('/auth/verify', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data: any) =>
    api.patch('/auth/change-password', data),
}

export const propertyService = {
  getAll: (params?: any) =>
    api.get('/properties', { params }),
  getById: (id: string) =>
    api.get(`/properties/${id}`),
  create: (data: any) =>
    api.post('/properties', data),
  toggleLike: (id: string) =>
    api.post(`/properties/${id}/like`),
  update: (id: string, data: any) =>
    api.patch(`/properties/${id}`, data),
  delete: (id: string) =>
    api.delete(`/properties/${id}`),
  search: (filters: any) =>
    api.get('/properties', { params: filters }),
}

export const adminService = {
  // Users
  getUsers: () => api.get('/admin/users'),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  // Properties
  getProperties: () => api.get('/admin/properties'),
  getProperty: (id: string) => api.get(`/admin/properties/${id}`),
  updateProperty: (id: string, data: any) => api.patch(`/admin/properties/${id}`, data),
  deleteProperty: (id: string) => api.delete(`/admin/properties/${id}`),
  createProperty: (data: any) => api.post('/admin/properties', data),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.patch('/admin/settings', data),
}

export default api
