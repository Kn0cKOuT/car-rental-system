import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminAPI = {
    registerAdmin: (username: string, password: string) => {
        return api.post('/api/auth/register/admin', {
          username,
          password,
        });
    },
    getAdmins: () => {
        return api.get('/api/admin/admins');
    }
};

export const authAPI = {
  registerCustomer: (userData: {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    driverLicenseNo: string,
    creditCardNumber: string, 
    expDate: string, 
    cvv: string
  }) => {
    return api.post('/api/auth/register/customer', userData);
  },
  checkUsername: (username: string) => {
    return api.get(`/api/auth/check-username?username=${username}`);
  },
  login: (credentials: { username: string; password: string }) => {
  return api.post('/api/auth/login', credentials);
  }
 
};

export default api; 