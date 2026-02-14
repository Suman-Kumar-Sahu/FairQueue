import api from './api';

const getCenters = async () => {
  const response = await api.get('/centers');
  return response.data;
};

const getCenter = async (id) => {
  const response = await api.get(`/centers/${id}`);
  return response.data;
};

const centerService = {
  getCenters,
  getCenter,
};

export default centerService;