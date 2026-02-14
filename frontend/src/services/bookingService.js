import api from './api';

const createBooking = async (bookingData, token) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

const getMyBookings = async (token) => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

const getBooking = async (id, token) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

const cancelBooking = async (id, reason, token) => {
  const response = await api.put(`/bookings/${id}/cancel`, { reason });
  return response.data;
};

const bookingService = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
};

export default bookingService;