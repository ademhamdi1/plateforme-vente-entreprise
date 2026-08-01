import api from './api';

export const authService = {
  // Register new user - Saved to PostgreSQL
  async register(userData) {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  // Login - Check credentials from PostgreSQL
  async login(email, password) {
    const response = await api.post('/users/login/', { email, password });
    
    if (response.data.access) {
      // Save tokens to localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Get user profile from PostgreSQL
      const profile = await this.getProfile();
      localStorage.setItem('user_type', profile.user_type);
    }
    
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
  },

  // Get current user profile from PostgreSQL
  async getProfile() {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Get access token
  getToken() {
    return localStorage.getItem('access_token');
  },

  // Get user type
  getUserType() {
    return localStorage.getItem('user_type');
  },
};
