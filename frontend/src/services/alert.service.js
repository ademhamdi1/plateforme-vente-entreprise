import api from './api';

const AlertService = {
  // Récupérer toutes les alertes de l'utilisateur
  getAll: async () => {
    try {
      const response = await api.get('/users/alerts/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer une nouvelle alerte
  create: async (alertData) => {
    try {
      const response = await api.post('/users/alerts/', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une alerte
  update: async (id, alertData) => {
    try {
      const response = await api.put(`/users/alerts/${id}/`, alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une alerte
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/alerts/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Activer/Désactiver une alerte
  toggle: async (id, isActive) => {
    try {
      const response = await api.patch(`/users/alerts/${id}/`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AlertService;
