import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: '/api', // Proxied by Vite in development to http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finshield_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('finshield_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getSetupStatus: () => api.get('/auth/setup-status'),
  setupFirstAdmin: (data) => api.post('/auth/setup', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const transactionService = {
  getTransactions: (params) => api.get('/transactions', { params }),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  getStats: () => api.get('/transactions/stats'),
};

export const graphService = {
  getAnalysis: () => api.get('/graph/analysis'),
  getCycles: () => api.get('/graph/cycles'),
  getNetwork: () => api.get('/graph/network'),
};

export const uploadService = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
