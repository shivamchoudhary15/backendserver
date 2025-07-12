import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendserver-pf4h.onrender.com/api', // ye backend render ki url hai 
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = userData => API.post('/users/add', userData);
export const login = userData => API.post('/users/login', userData);
export const getUsers = () => API.get('/users/view');

export const createBooking = bookingData => API.post('/bookings/create', bookingData);
export const getBookings = userid => API.get(`/bookings/view?userid=${userid}`);

export const getServices = () => API.get('/services');
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = id => API.put(`/notifications/${id}`);
export const createPayment = paymentData => API.post('/payments', paymentData);
export const getPayments = () => API.get('/payments');
export const createReview = reviewData => API.post('/reviews/submit', reviewData);
export const getReviews = () => API.get('/reviews/view');
export const deleteReview = id => API.delete(`/reviews/${id}`);
