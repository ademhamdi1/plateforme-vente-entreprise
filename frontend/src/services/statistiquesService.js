import api from './api';

export const statistiquesService = {
  // Récupérer statistiques détaillées d'une entreprise depuis PostgreSQL
  async getStatistiquesEntreprise(slug) {
    const response = await api.get(`/entreprises/${slug}/statistiques/`);
    return response.data;
  },

  // Récupérer vue d'ensemble des stats pour le dashboard vendeur depuis PostgreSQL
  async getStatistiquesDashboard() {
    const response = await api.get('/entreprises/statistiques/dashboard/');
    return response.data;
  },

  // Enregistrer une action utilisateur - sauvegardée dans PostgreSQL
  async enregistrerAction(slug, action = 'vue') {
    try {
      const response = await api.post(`/entreprises/${slug}/enregistrer-action/`, {
        action
      });
      return response.data;
    } catch (err) {
      // Silencieux - ne pas bloquer l'expérience utilisateur
      console.error('Erreur enregistrement action:', err);
      return null;
    }
  },
};
