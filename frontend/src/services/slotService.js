import api from './api';

const getSlots = async (centerId, date) => {
  const response = await api.get(`/slots?center=${centerId}&date=${date}`);
  return response.data;
};

const getSlot = async (id) => {
  const response = await api.get(`/slots/${id}`);
  return response.data;
};

const getAlternatives = async (slotId) => {
  const response = await api.get(`/slots/${slotId}/alternatives`);
  return response.data;
};

const getSlotSummary = async (centerId, date) => {
  const response = await api.get(`/slots/summary?center=${centerId}&date=${date}`);
  return response.data;
};

const slotService = {
  getSlots,
  getSlot,
  getAlternatives,
  getSlotSummary,
};

export default slotService;