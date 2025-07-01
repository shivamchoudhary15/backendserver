// src/api/api.js
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== Auth ====================
export const signup = (userData) => API.post('/users/add', userData);
export const login = (userData) => API.post('/users/login', userData);
export const getUsers = () => API.get('/users/view');

// ==================== Bookings ====================
export const createBooking = (bookingData) => API.post('/bookings/create', bookingData);
export const getBookings = () => API.get('/bookings/view');

// ==================== Services ====================
export const getServices = () => API.get('/services');

// ==================== Notifications ====================
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}`);

// ==================== Payments ====================
export const createPayment = (paymentData) => API.post('/payments', paymentData);
export const getPayments = () => API.get('/payments');

// ==================== Reviews ====================
export const createReview = (reviewData) => API.post('/reviews/submit', reviewData);
export const getReviews = () => API.get('/reviews/view');
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
