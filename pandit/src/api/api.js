// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendserver-6-yebf.onrender.com/api',
});

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

// === Auth ===
export const signup = (userData) => API.post('/users/add', userData);
export const login = (userData) => API.post('/users/login', userData);
export const getUsers = () => API.get('/users/view');

// === Bookings ===
export const createBooking = (bookingData) => API.post('/bookings/create', bookingData);
export const getBookings = (userid) => API.get(`/bookings/view?userid=${userid}`);


// === Services ===
export const getServices = () => API.get('/services');

// === Notifications ===
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}`);

// === Payments ===
export const createPayment = (paymentData) => API.post('/payments', paymentData);
export const getPayments = () => API.get('/payments');

// === Reviews ===
export const createReview = (reviewData) => API.post('/reviews/submit', reviewData);
export const getReviews = () => API.get('/reviews/view');
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

