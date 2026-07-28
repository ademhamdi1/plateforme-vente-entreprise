import api from './api';

const EntrepriseService = {
  async getAll(params = {}) {
    const response = await api.get('/entreprises/', { params });
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/entreprises/${slug}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/entreprises/create/', data);
    return response.data;
  },

  async update(slug, data) {
    const response = await api.put(`/entreprises/${slug}/update/`, data);
    return response.data;
  },

  async delete(slug) {
    const response = await api.delete(`/entreprises/${slug}/delete/`);
    return response.data;
  },

  async getMine() {
    const response = await api.get('/entreprises/mes-entreprises/');
    return response.data;
  },

  async uploadImage(formData) {
    const response = await api.post('/entreprises/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadDocument(formData) {
    const response = await api.post('/entreprises/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async addFavorite(entrepriseId) {
    const response = await api.post('/users/saved/', { entreprise: entrepriseId });
    return response.data;
  },

  async removeFavorite(entrepriseId) {
    const response = await api.delete(`/users/saved/${entrepriseId}/`);
    return response.data;
  },

  async getFavorites() {
    const response = await api.get('/users/saved/');
    return response.data;
  },

  // Messagerie
  async getConversations() {
    return await api.get('/messaging/conversations/');
  },

  async getMessages(conversationId) {
    return await api.get(`/messaging/conversations/${conversationId}/`);
  },

  async sendMessage(conversationId, data) {
    return await api.post('/messaging/messages/create/', {
      conversation: conversationId,
      ...data
    });
  },

  async markMessagesAsRead(conversationId) {
    return await api.post(`/messaging/conversations/${conversationId}/mark-read/`);
  },

  async sendContactRequest(data) {
    return await api.post('/messaging/contact-requests/create/', data);
  },

  async getContactRequests() {
    return await api.get('/messaging/contact-requests/');
  },
};

export default EntrepriseService;
