import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


export const axiosAuthInstance = axios.create({
  baseURL: 'http://localhost:3000/api/', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

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
