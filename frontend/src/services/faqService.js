import api from './api';

const faqService = {
  async getAll() {
    const response = await api.get('/entreprises/faq/');
    return response.data;
  },

  async getAllAdmin() {
    const response = await api.get('/entreprises/admin/faq/');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/entreprises/admin/faq/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/entreprises/admin/faq/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/entreprises/admin/faq/${id}/`);
  },
};

export default faqService;
