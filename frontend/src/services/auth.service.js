import api from './api';

const AuthService = {
  async login(username, password) {
    const response = await api.post('/users/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/users/profile/');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async updateProfile(profileData) {
    try {
      const response = await api.patch('/users/profile/', profileData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      console.log('=== Change Password Request ===');
      console.log('URL:', '/users/change-password/');
      console.log('Data:', { old_password: '***', new_password: '***' });
      
      const response = await api.post('/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      console.log('=== Change Password Success ===');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== Change Password Error ===');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Data:', error.response?.data);
      console.error('Full Error:', error);
      throw error;
    }
  },
};

export default AuthService;
