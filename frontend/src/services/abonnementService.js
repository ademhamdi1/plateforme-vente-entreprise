import api from './api';

export const abonnementService = {
  // Récupérer mon abonnement actuel depuis PostgreSQL
  async getMonAbonnement() {
    const response = await api.get('/users/abonnement/');
    return response.data;
  },

  // Récupérer les plans disponibles
  async getPlans() {
    const response = await api.get('/users/abonnement/plans/');
    return response.data;
  },

  // Upgrade abonnement - sauvegardé dans PostgreSQL
  async upgradeAbonnement(plan, dureeMois = 1, methodePaiement = 'carte') {
    const response = await api.post('/users/abonnement/upgrade/', {
      plan,
      duree_mois: dureeMois,
      methode_paiement: methodePaiement
    });
    return response.data;
  },

  // Annuler l'abonnement - mis à jour dans PostgreSQL
  async annulerAbonnement() {
    const response = await api.post('/users/abonnement/annuler/');
    return response.data;
  },

  // Récupérer l'historique des paiements depuis PostgreSQL
  async getHistoriquePaiements() {
    const response = await api.get('/users/abonnement/paiements/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },
};
