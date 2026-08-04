import api from './api';

const entrepriseService = {
  // Get all published entreprises from PostgreSQL
  async getAll(params = {}) {
    const response = await api.get('/entreprises/', { params });
    // Django REST Framework returns paginated response with 'results'
    return response.data.results || response.data;
  },

  // Get single entreprise by slug from PostgreSQL (increments views)
  async getBySlug(slug) {
    const response = await api.get(`/entreprises/${slug}/`);
    return response.data;
  },

  // Alias for getBySlug
  async getEntreprise(slug) {
    return this.getBySlug(slug);
  },

  // Create new entreprise - Saved to PostgreSQL (vendeur only)
  async create(data) {
    const response = await api.post('/entreprises/create/', data);
    return response.data;
  },

  // Update entreprise - Saved to PostgreSQL (vendeur only)
  async update(slug, data) {
    const response = await api.put(`/entreprises/${slug}/update/`, data);
    return response.data;
  },

  // Get my entreprises from PostgreSQL (vendeur only)
  async getMesEntreprises() {
    const response = await api.get('/entreprises/mes-entreprises/');
    // Django REST Framework returns paginated response with 'results'
    return response.data.results || response.data;
  },

  // Get featured entreprises from PostgreSQL (public)
  async getFeatured() {
    const response = await api.get('/entreprises/mises-en-avant/');
    return response.data;
  },

  // Get sector counts from PostgreSQL (public)
  async getSecteurs() {
    const response = await api.get('/entreprises/secteurs/');
    return response.data;
  },

  // Get personalized recommendations from PostgreSQL (acheteur only)
  async getRecommandations(limit = 6) {
    const response = await api.get('/entreprises/recommandations/', {
      params: { limit }
    });
    return response.data;
  },

  // Get similar entreprises from PostgreSQL (public)
  async getSimilaires(slug, limit = 4) {
    const response = await api.get(`/entreprises/${slug}/similaires/`, {
      params: { limit }
    });
    return response.data;
  },

  // Upload image for entreprise - Saved to PostgreSQL + filesystem
  async uploadImage(entrepriseId, formData) {
    const response = await api.post('/entreprises/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default entrepriseService;
