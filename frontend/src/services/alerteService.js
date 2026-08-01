import api from './api';

export const alerteService = {
  // Récupérer mes alertes depuis PostgreSQL
  async getMesAlertes() {
    const response = await api.get('/users/alertes/');
    return response.data.results || response.data;
  },

  // Créer une alerte - sauvegardée dans PostgreSQL
  async creerAlerte(alerteData) {
    const response = await api.post('/users/alertes/create/', alerteData);
    return response.data;
  },

  // Mettre à jour une alerte - mise à jour dans PostgreSQL
  async updateAlerte(alerteId, alerteData) {
    const response = await api.patch(`/users/alertes/${alerteId}/`, alerteData);
    return response.data;
  },

  // Supprimer une alerte - suppression de PostgreSQL
  async supprimerAlerte(alerteId) {
    const response = await api.delete(`/users/alertes/${alerteId}/`);
    return response.data;
  },

  // Activer/Désactiver une alerte - mise à jour dans PostgreSQL
  async toggleAlerte(alerteId) {
    const response = await api.post(`/users/alertes/${alerteId}/toggle/`);
    return response.data;
  },
};
