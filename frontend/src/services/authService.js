import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await api.put('/auth/updatedetails', userData);
  if (response.data.success) {
    // Get existing user data
    const existingUser = JSON.parse(localStorage.getItem('user'));
    // Merge with updated data
    const updatedUser = {
      ...existingUser,
      ...response.data.data,
      token: existingUser.token // Preserve token
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/updatepassword', passwordData);
  if (response.data.success && response.data.data?.token) {
    // Update token in localStorage
    const existingUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...existingUser,
      token: response.data.data.token
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword
};

export default authService;