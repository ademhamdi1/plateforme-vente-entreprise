import api from './api';

export const mediaService = {
  // ========== IMAGES ==========
  
  // Récupérer les images d'une entreprise depuis PostgreSQL
  async getImages(slug) {
    const response = await api.get(`/entreprises/${slug}/images/`);
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Upload une image - sauvegardée dans PostgreSQL + /media/
  async uploadImage(slug, imageFile, legende = '', ordre = 0, isLogo = false) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('legende', legende);
    formData.append('ordre', ordre);
    formData.append('is_logo', isLogo ? 'true' : 'false');

    const response = await api.post(`/entreprises/${slug}/images/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer une image - supprimée de PostgreSQL + /media/
  async deleteImage(slug, imageId) {
    const response = await api.delete(`/entreprises/${slug}/images/${imageId}/delete/`);
    return response.data;
  },

  // ========== DOCUMENTS ==========
  
  // Récupérer les documents d'une entreprise depuis PostgreSQL
  async getDocuments(slug) {
    const response = await api.get(`/entreprises/${slug}/documents/`);
    // Extract results if paginated, otherwise return data directly
    return response.data.results || response.data;
  },

  // Upload un document PDF - sauvegardé dans PostgreSQL + /media/
  async uploadDocument(slug, documentFile, nom = '', description = '') {
    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('nom', nom || documentFile.name);
    formData.append('description', description);

    const response = await api.post(`/entreprises/${slug}/documents/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un document - supprimé de PostgreSQL + /media/
  async deleteDocument(slug, documentId) {
    const response = await api.delete(`/entreprises/${slug}/documents/${documentId}/delete/`);
    return response.data;
  },
};
