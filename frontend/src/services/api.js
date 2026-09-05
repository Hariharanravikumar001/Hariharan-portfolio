import axios from 'axios';

const formatBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    // If running in browser and not on localhost, use the live Render backend
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://hariharan-portfolio-backend.onrender.com/api';
    }
    return '/api';
  }
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, '');
  if (url.endsWith('/api')) {
    return url;
  }
  return `${url}/api`;
};

const baseURL = formatBaseUrl();

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwords) => api.put('/auth/update-password', passwords),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadImage: (formData) =>
    api.post('/profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const skillsApi = {
  getAll: (category) => api.get('/skills', { params: { category } }),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const projectsApi = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (idOrSlug) => api.get(`/projects/${idOrSlug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const experiencesApi = {
  getAll: () => api.get('/experiences'),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`),
};

export const certificatesApi = {
  getAll: (params) => api.get('/certificates', { params }),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

export const resumesApi = {
  getActive: (category) => api.get('/resumes', { params: { category } }),
  getAllAdmin: () => api.get('/resumes/admin/all'),
  downloadAndTrack: (id) => api.post(`/resumes/${id}/download`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  toggleActive: (id) => api.patch(`/resumes/${id}/toggle`),
};

export const contactApi = {
  submit: (data) => api.post('/contact', data),
  getMessages: (params) => api.get('/contact/messages', { params }),
  updateStatus: (id, data) => api.patch(`/contact/messages/${id}`, data),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
  exportCSVUrl: () => `${baseURL}/contact/export-csv`,
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getVisitorDetails: () => api.get('/analytics/visitors'),
  getPublicCounter: () => api.get('/analytics/public-counter'),
};

export default api;
