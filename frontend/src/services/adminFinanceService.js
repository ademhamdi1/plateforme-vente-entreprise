import api from './api';

const adminFinanceService = {
  async getDashboard() {
    const response = await api.get('/users/admin/finance/dashboard/');
    return response.data;
  },

  async getPayments(params = {}) {
    const response = await api.get('/users/admin/finance/payments/', { params });
    return response.data;
  },

  async getAbonnements(params = {}) {
    const response = await api.get('/users/admin/finance/abonnements/', { params });
    return response.data;
  },
};

export default adminFinanceService;
