import api from './api';

const adminUserService = {
  async getAll(params = {}) {
    const response = await api.get('/users/admin/users/', { params });
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/users/admin/users/${id}/`, data);
    return response.data;
  },

  async toggleActive(id) {
    const response = await api.post(`/users/admin/users/${id}/toggle-active/`);
    return response.data;
  },

  async toggleVerify(id) {
    const response = await api.post(`/users/admin/users/${id}/verify/`);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/users/admin/users/${id}/`);
  },
};

export default adminUserService;
