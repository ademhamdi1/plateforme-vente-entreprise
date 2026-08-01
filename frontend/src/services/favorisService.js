import api from './api';

export const favorisService = {
  // Récupérer la liste des favoris depuis PostgreSQL
  async getFavoris() {
    const response = await api.get('/entreprises/favoris/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Ajouter une entreprise aux favoris - sauvegardé dans PostgreSQL
  async addFavori(entrepriseSlug) {
    const response = await api.post('/entreprises/favoris/add/', {
      entreprise_slug: entrepriseSlug
    });
    return response.data;
  },

  // Retirer une entreprise des favoris - supprimé de PostgreSQL
  async removeFavori(entrepriseSlug) {
    const response = await api.delete(`/entreprises/favoris/${entrepriseSlug}/remove/`);
    return response.data;
  },

  // Vérifier si une entreprise est favorite - depuis PostgreSQL
  async checkFavoriStatus(entrepriseSlug) {
    const response = await api.get(`/entreprises/favoris/${entrepriseSlug}/status/`);
    return response.data;
  },

  // Récupérer le nombre total de favoris depuis PostgreSQL
  async getFavorisCount() {
    const response = await api.get('/entreprises/favoris/count/');
    return response.data.count;
  },
};
