import api from './api';

export const temoignageService = {
  // Récupérer les témoignages publics depuis PostgreSQL
  async getTemoignagesPublics() {
    const response = await api.get('/users/temoignages/publics/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Créer un témoignage - sauvegardé dans PostgreSQL
  async creerTemoignage(data) {
    const response = await api.post('/users/temoignages/create/', data);
    return response.data;
  },

  // Mes témoignages - depuis PostgreSQL
  async getMesTemoignages() {
    const response = await api.get('/users/temoignages/mes-temoignages/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // === ADMIN ===

  // Liste tous les témoignages (admin)
  async getAdminTemoignages(statut = null) {
    const url = statut 
      ? `/users/temoignages/admin/?statut=${statut}`
      : '/users/temoignages/admin/';
    const response = await api.get(url);
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Publier un témoignage (admin)
  async publierTemoignage(id) {
    const response = await api.post(`/users/temoignages/admin/${id}/publier/`);
    return response.data;
  },

  // Supprimer un témoignage (admin)
  async supprimerTemoignage(id) {
    const response = await api.delete(`/users/temoignages/admin/${id}/supprimer/`);
    return response.data;
  },

  // Statistiques témoignages (admin)
  async getStatsTemoignages() {
    const response = await api.get('/users/temoignages/admin/stats/');
    return response.data;
  },
};
