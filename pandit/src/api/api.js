import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendserver-pf4h.onrender.com/api', // your Render backend URL
});

// Attach token to all requests if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Devotee Auth
export const signup = userData => API.post('/users/add', userData);
export const login = userData => API.post('/users/login', userData);
export const getAllDevotees = () => API.get('/users/view');


// 🔹 Pandit Auth
export const panditSignup = data => API.post('/pandits/signup', data);
export const panditLogin = data => API.post('/pandits/login', data);

// 🔹 Admin: View All
export const getUsers = () => API.get('/users/view');
export const getAllPandits = () => API.get('/pandits/admin-view');

// 🔹 Admin: Pandit Management
export const verifyPandit = id => API.put(`/pandits/verify/${id}`);
export const uploadPanditPhoto = (id, formData) =>
  API.post(`/pandits/upload/${id}`, formData);

// 🔹 Pandit (Public)
export const getVerifiedPandits = () => API.get('/pandits/view');

// 🔹 Pooja Management
export const getPoojas = () => API.get('/poojas/view');
export const addPooja = poojaData => API.post('/poojas/add', poojaData);
export const updatePooja = (id, data) => API.put(`/poojas/update/${id}`, data);
export const deletePooja = id => API.delete(`/poojas/delete/${id}`);

// 🔹 Booking
export const createBooking = bookingData => API.post('/bookings/create', bookingData);
export const getBookings = userid => API.get(`/bookings/view?userid=${userid}`);

// 🔹 Services
export const getServices = () => API.get('/services');

// 🔹 Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = id => API.put(`/notifications/${id}`);

// 🔹 Payments
export const createPayment = paymentData => API.post('/payments', paymentData);
export const getPayments = () => API.get('/payments');

// 🔹 Reviews
export const createReview = reviewData => API.post('/reviews/submit', reviewData);
export const getReviews = () => API.get('/reviews/view');
export const deleteReview = id => API.delete(`/reviews/${id}`);
