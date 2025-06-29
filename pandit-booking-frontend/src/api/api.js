import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming token stored in localStorage after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const signup = (userData) => API.post('/users/add', userData);
export const login = (userData) => API.post('/users/login', userData);
export const getUsers = () => API.get('/users/view');


export const createBooking = (bookingData) => API.post('/bookings/create', bookingData);
export const getBookings = () => API.get('/bookings/view');

export const getServices = () => API.get('/services'); // Adjust route if needed

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

