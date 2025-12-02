import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/api'
  : '/api';
console.log("API_BASE_URL >> ", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token
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

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
  search: (keyword) => api.get(`/students/search?keyword=${keyword}`),
  getActive: () => api.get('/students/active'),
  getActiveCount: () => api.get('/students/count/active'),
  getWithPaymentStatus: (yearMonth) => api.get(`/students/payment-status?yearMonth=${yearMonth}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getByRange: (startDate, endDate) => api.get(`/attendance/range?startDate=${startDate}&endDate=${endDate}`),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  createOrUpdate: (attendance) => api.post('/attendance', attendance),
  delete: (id) => api.delete(`/attendance/${id}`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  getByYearMonth: (yearMonth) => api.get(`/payments/month/${yearMonth}`),
  create: (payment) => api.post('/payments', payment),
  update: (id, payment) => api.put(`/payments/${id}`, payment),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Expense API
export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  getById: (id) => api.get(`/expenses/${id}`),
  getByType: (type) => api.get(`/expenses/type?type=${type}`),
  getByRange: (startDate, endDate) => api.get(`/expenses/range?startDate=${startDate}&endDate=${endDate}`),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Schedule API
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  getByDate: (date) => api.get(`/schedules/date/${date}`),
  getByRange: (startDate, endDate) => api.get(`/schedules/range?startDate=${startDate}&endDate=${endDate}`),
  create: (schedule) => api.post('/schedules', schedule),
  update: (id, schedule) => api.put(`/schedules/${id}`, schedule),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Education Record API
export const educationAPI = {
  getAll: () => api.get('/education'),
  getById: (id) => api.get(`/education/${id}`),
  getByYearMonth: (yearMonth) => api.get(`/education/year-month/${yearMonth}`),
  create: (record) => api.post('/education', record),
  update: (id, record) => api.put(`/education/${id}`, record),
  delete: (id) => api.delete(`/education/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/education/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Finance API
export const financeAPI = {
  getSummary: (yearMonth) => api.get(`/finance/summary?yearMonth=${yearMonth}`),
  downloadExcel: (yearMonth) => api.get(`/finance/export?yearMonth=${yearMonth}`, {
    responseType: 'blob',
  }),
};

// Subject API
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (subject) => api.post('/subjects', subject),
  update: (id, subject) => api.put(`/subjects/${id}`, subject),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (filename) => api.delete(`/upload/image?filename=${filename}`),
};

export default api;
