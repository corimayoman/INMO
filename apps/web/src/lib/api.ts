import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });
          Cookies.set('access_token', data.accessToken, { expires: 1 / 96 }); // 15 min
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// API helpers
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get('/auth/me'),
};

export const listingsApi = {
  search: (params: any) => api.get('/search', { params }),
  getBySlug: (slug: string) => api.get(`/listings/${slug}`),
  getSimilar: (id: string) => api.get(`/listings/${id}/similar`),
  create: (data: any) => api.post('/listings', data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  publish: (id: string) => api.patch(`/listings/${id}/publish`),
  delete: (id: string) => api.delete(`/listings/${id}`),
};

export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  toggle: (listingId: string) => api.post(`/favorites/${listingId}`),
  status: (listingId: string) => api.get(`/favorites/${listingId}/status`),
};

export const savedSearchesApi = {
  getAll: () => api.get('/saved-searches'),
  create: (data: any) => api.post('/saved-searches', data),
  update: (id: string, data: any) => api.put(`/saved-searches/${id}`, data),
  delete: (id: string) => api.delete(`/saved-searches/${id}`),
};

export const inquiriesApi = {
  create: (data: any) => api.post('/inquiries', data),
  getForAgent: (status?: string) => api.get('/inquiries/agent', { params: { status } }),
};

export const viewingsApi = {
  schedule: (data: any) => api.post('/viewings', data),
  getMy: () => api.get('/viewings/my'),
  getForAgent: () => api.get('/viewings/agent'),
};

export const aiApi = {
  parseSearch: (query: string) => api.post('/ai/search/parse', { query }),
  enhanceDescription: (data: any) => api.post('/ai/description/enhance', data),
  translate: (text: string, targetLanguage: string) => api.post('/ai/description/translate', { text, targetLanguage }),
};

export const autocompleteApi = {
  search: (q: string) => api.get('/search/autocomplete', { params: { q } }),
};
