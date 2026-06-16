import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
    const authData = JSON.parse(localStorage.getItem('lahore-traditional-auth') || '{}');
    const token = authData?.state?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => Promise.reject(error));

  // Response interceptor — handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const authData = JSON.parse(localStorage.getItem('lahore-traditional-auth') || '{}');
          const refreshToken = authData?.state?.refreshToken;
          if (refreshToken) {
            const { data } = await axios.post('/api/auth/refresh', { refreshToken });
            const newAuth = { ...authData, state: { ...authData.state, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken } };
            localStorage.setItem('lahore-traditional-auth', JSON.stringify(newAuth));
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch { /* refresh failed, user will be logged out */ }
    }
    return Promise.reject(error);
  }
);

export default api;
