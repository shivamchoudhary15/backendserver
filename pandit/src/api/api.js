import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendserver-1-pa6o.onrender.com/api', // Update with your backend URL
});

//  Automatically attach token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//loactions
export const postLocation = ({ latitude, longitude, userId }) =>
  API.post('/locations/view', { latitude, longitude, userId }); // userId optional

export const getLocations = (userId) =>
  API.get(`/locations${userId ? `?userId=${userId}` : ''}`);


//  OTP
export const sendOtp = email => API.post('/users/send-otp', { email });
export const verifyOtp = (email, otp) => API.post('/users/verify-otp', { email, otp });

//  Devotee Auth
//
export const signup = userData => API.post('/users/add', userData);
export const login = userData => API.post('/users/login', userData);
export const getAllDevotees = () => API.get('/users/view');

//
// 🔹 Pandit Auth
//
export const panditSignup = data => API.post('/pandits/signup', data);
export const panditLogin = data => API.post('/pandits/login', data);

//
// 🔹 Admin: View
//
export const getUsers = () => API.get('/users/view');
export const getAllPandits = () => API.get('/pandits/admin-view');
export const getAllPoojas = () => API.get('/poojas/view');

//
// 🔹 Admin: Pandit Management
//


//
// 🔹 Google Auth
export const googleLogin = (credential) =>
  API.post('/users/google-login', { credential });

export const verifyPandit = id => API.put(`/pandits/verify/${id}`);
export const uploadPanditPhoto = (id, formData) =>
  API.post(`/pandits/upload/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

//
// 🔹 Pandit (Public)
//
export const getVerifiedPandits = () => API.get('/pandits/view');
export const deletePandit = async (id) => {
  return await fetch(`https://backendserver-dryq.onrender.com/api/pandits/delete/${id}`, {
    method: 'DELETE',
  });
};


//
// 🔹 Pooja Management
//
export const getPoojas = () => API.get('/poojas/view');
export const addPooja = poojaData => API.post('/poojas/add', poojaData);
export const updatePooja = (id, data) => API.put(`/poojas/update/${id}`, data);
export const deletePooja = id => API.delete(`/poojas/delete/${id}`);

//
// 🔹 Booking
//
export const createBooking = bookingData => API.post('/bookings/create', bookingData);
export const getBookings = (params = {}) => API.get('/bookings/view', { params });
export const getBookingsByUser = (userid) => API.get(`/bookings/user/${userid}`);



//
// 🔹 Services
//
export const getServices = () => API.get('/services/view');

//
// 🔹 Notifications
//
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = id => API.put(`/notifications/${id}`);

//
// 🔹 Payments
//
export const createPayment = paymentData => API.post('/payments', paymentData);
export const getPayments = () => API.get('/payments');

//
// 🔹 Reviews
//
export const createReview = reviewData => API.post('/reviews/submit', reviewData);
export const getReviews = () => API.get('/reviews/view');
export const deleteReview = id => API.delete(`/reviews/${id}`);
