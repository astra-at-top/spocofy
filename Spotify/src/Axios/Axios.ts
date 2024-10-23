import axios from 'axios';

// Create an axios instance without authentication
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/', // Replace with your API base URL
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an axios instance with authentication
export const axiosAuthInstance = axios.create({
  baseURL: 'http://localhost:3000/api/', // Replace with your API base URL
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to the authenticated instance
axiosAuthInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh (if needed)
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Implement your token refresh logic here
      // For example:
      // const newToken = await refreshToken();
      // localStorage.setItem('token', newToken);
      // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      // return axiosAuthInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
