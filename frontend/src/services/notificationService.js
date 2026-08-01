import api from './api';

export const notificationService = {
  // Récupérer les notifications depuis PostgreSQL
  async getNotifications() {
    const response = await api.get('/users/notifications/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Récupérer le nombre de notifications non lues depuis PostgreSQL
  async getUnreadCount() {
    const response = await api.get('/users/notifications/count/');
    return response.data.count;
  },

  // Marquer une notification comme lue - mis à jour dans PostgreSQL
  async marquerCommeLue(notificationId) {
    const response = await api.post(`/users/notifications/${notificationId}/lue/`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues - mis à jour dans PostgreSQL
  async marquerToutCommeLu() {
    const response = await api.post('/users/notifications/marquer-tout-lu/');
    return response.data;
  },
};
