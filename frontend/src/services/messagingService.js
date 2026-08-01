import api from './api';

export const messagingService = {
  // Récupérer toutes les conversations depuis PostgreSQL
  async getConversations() {
    const response = await api.get('/entreprises/messages/conversations/');
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Récupérer une conversation avec tous les messages depuis PostgreSQL
  async getConversation(conversationId) {
    const response = await api.get(`/entreprises/messages/conversations/${conversationId}/`);
    return response.data;
  },

  // Créer une nouvelle conversation - sauvegardée dans PostgreSQL
  async createConversation(entrepriseSlug) {
    const response = await api.post('/entreprises/messages/conversations/create/', {
      entreprise_slug: entrepriseSlug
    });
    return response.data;
  },

  // Envoyer un message - sauvegardé dans PostgreSQL
  async sendMessage(conversationId, content) {
    const response = await api.post(
      `/entreprises/messages/conversations/${conversationId}/send/`,
      { content }
    );
    return response.data;
  },

  // Archiver une conversation - mis à jour dans PostgreSQL
  async archiveConversation(conversationId) {
    const response = await api.post(
      `/entreprises/messages/conversations/${conversationId}/archive/`
    );
    return response.data;
  },

  // Récupérer le nombre de messages non lus depuis PostgreSQL
  async getUnreadCount() {
    const response = await api.get('/entreprises/messages/unread-count/');
    return response.data.unread_count;
  },
};
