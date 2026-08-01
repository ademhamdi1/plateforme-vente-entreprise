import api from './api';

const adminService = {
  // Get entreprises en attente from PostgreSQL (admin only)
  async getEntreprisesEnAttente() {
    const response = await api.get('/entreprises/admin/en-attente/');
    return response.data.results || response.data;
  },

  // Get entreprises publiées from PostgreSQL (admin only)
  async getEntreprisesPubliees() {
    const response = await api.get('/entreprises/admin/publiees/');
    return response.data.results || response.data;
  },

  // Get statistiques from PostgreSQL (admin only)
  async getStatistiques() {
    const response = await api.get('/entreprises/admin/statistiques/');
    return response.data;
  },

  // Valider entreprise - Save to PostgreSQL (admin only)
  async validerEntreprise(slug) {
    const response = await api.post(`/entreprises/admin/${slug}/valider/`);
    return response.data;
  },

  // Refuser entreprise - Save to PostgreSQL (admin only)
  async refuserEntreprise(slug, raison) {
    const response = await api.post(`/entreprises/admin/${slug}/refuser/`, {
      raison_refus: raison,
    });
    return response.data;
  },

  // Mettre en avant entreprise - Save to PostgreSQL (admin only)
  async mettreEnAvant(slug, dureeJours = 30) {
    const response = await api.post(`/entreprises/admin/${slug}/mettre-en-avant/`, {
      duree_jours: dureeJours,
    });
    return response.data;
  },

  // Retirer mise en avant - Save to PostgreSQL (admin only)
  async retirerMiseEnAvant(slug) {
    const response = await api.post(`/entreprises/admin/${slug}/retirer-mise-en-avant/`);
    return response.data;
  },
};

export default adminService;
