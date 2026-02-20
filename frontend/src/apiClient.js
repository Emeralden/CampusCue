import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        const { data } = await apiClient.post('/users/token/refresh', {
          refresh_token: refreshToken,
        });

        localStorage.setItem('accessToken', data.access_token);
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

        return apiClient(originalRequest);
        
      } catch (refreshError) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.replace('/login');
  return new Promise(() => {});
}
    }

    return Promise.reject(error);
  }
);

export default apiClient;