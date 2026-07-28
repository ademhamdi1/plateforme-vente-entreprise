import api from './api';

const NotificationService = {
  async getAll() {
    const response = await api.get('/notifications/');
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread_count/');
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.post(`/notifications/${id}/mark_as_read/`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark_all_as_read/');
    return response.data;
  },
};

export default NotificationService;
