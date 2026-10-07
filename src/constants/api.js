// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Endpoints
export const endpoints = {
  auth: {
    base: '/auth',
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
    me: '/auth/me',
    google: '/auth/google',
  },
  notes: {
    base: '/notes',
    list: '/notes',
    create: '/notes',
    delete: (id) => `/notes/${id}`,
  },
  reminders: {
    base: '/reminders',
    vapidKey: '/reminders/vapid-key',
    test: '/reminders/test',
  },
}

// Build full URL
export const buildUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

// Get auth URL helper
export const getAuthUrl = () => buildUrl(endpoints.auth.base)