import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import adminFinanceService from '../services/adminFinanceService';

function AdminFinances() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    const value = Number(price || 0);
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminFinanceService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error loading finance dashboard:', err);
      setError('Erreur lors du chargement des données financières');

      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem('user_type');
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadDashboard();
  }, [navigate, loadDashboard]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (statut) => {
    const normalized = (statut || '').toString().toLowerCase();
    if (normalized === 'paye' || normalized === 'payé' || normalized === 'success' || normalized === 'succeeded' || normalized === 'completed') {
      return (
        <span className="badge-success">
          <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {statut}
        </span>
      );
    }
    if (normalized === 'en_attente' || normalized === 'pending' || normalized === 'en cours') {
      return (
        <span className="badge-warning">
          <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {statut}
        </span>
      );
    }
    if (normalized === 'echoue' || normalized === 'échoué' || normalized === 'failed' || normalized === 'cancelled' || normalized === 'canceled') {
      return (
        <span className="badge-danger">
          <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {statut}
        </span>
      );
    }
    return <span className="badge">{statut || '-'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            <svg className="animate-spin h-6 w-6 mr-2 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  const revenueByPlan = Array.isArray(dashboard?.revenue_by_plan) ? dashboard.revenue_by_plan : [];
  const activeSubsByPlan = Array.isArray(dashboard?.active_subs_by_plan) ? dashboard.active_subs_by_plan : [];
  const recentPayments = Array.isArray(dashboard?.recent_payments) ? dashboard.recent_payments : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="h-7 w-7 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Gestion Financière
            </h1>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-primary-600 border-2 border-primary-500 font-semibold hover:bg-primary-50 active:scale-95 transition-all duration-200 w-fit"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6 flex items-start gap-2">
            <svg className="h-5 w-5 text-danger-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* KPI Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-t-4 border-t-success-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Revenu Total</span>
                <svg className="h-6 w-6 text-success-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-success-600">{formatPrice(dashboard.total_revenue)}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-t-4 border-t-primary-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Revenu Mensuel</span>
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-primary-600">{formatPrice(dashboard.monthly_revenue)}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-t-4 border-t-accent-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Utilisateurs Total</span>
                <svg className="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{dashboard.total_users ?? 0}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-t-4 border-t-warning-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Total Vendeurs</span>
                <svg className="h-6 w-6 text-warning-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-warning-600">{dashboard.total_vendeurs ?? 0}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-t-4 border-t-danger-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Total Acheteurs</span>
                <svg className="h-6 w-6 text-danger-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-danger-600">{dashboard.total_acheteurs ?? 0}</div>
            </div>
          </div>
        )}

        {/* Revenue by Plan */}
        {dashboard && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <svg className="h-6 w-6 text-success-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Revenu par Plan
            </h2>

            {revenueByPlan.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-600 font-medium">Aucune donnée de revenu par plan disponible</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {revenueByPlan.map((item, index) => {
                  const planName = item.plan_nom || item.plan || item.name || `Plan ${index + 1}`;
                  const total = item.total ?? item.revenue ?? item.montant_total ?? 0;
                  const count = item.count ?? item.nombre ?? item.ventes ?? 0;
                  return (
                    <div key={`${planName}-${index}`} className="card">
                      <div className="text-sm text-gray-500 mb-1 truncate">{planName}</div>
                      <div className="text-2xl font-bold text-success-600 mb-1">{formatPrice(total)}</div>
                      <div className="text-xs text-gray-500">{count} paiement(s)</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Active Subscriptions by Plan */}
        {dashboard && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Abonnements Actifs par Plan
            </h2>

            {activeSubsByPlan.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-600 font-medium">Aucun abonnement actif</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeSubsByPlan.map((item, index) => {
                  const planName = item.plan_nom || item.plan || item.name || `Plan ${index + 1}`;
                  const count = item.count ?? item.nombre ?? item.actifs ?? item.active_count ?? 0;
                  return (
                    <div key={`${planName}-${index}`} className="card">
                      <div className="text-sm text-gray-500 mb-1 truncate">{planName}</div>
                      <div className="text-2xl font-bold text-primary-600 mb-1">{count}</div>
                      <div className="text-xs text-gray-500">abonnement(s) actif(s)</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Recent Payments */}
        {dashboard && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <svg className="h-6 w-6 text-accent-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
              Paiements Récents
            </h2>

            {recentPayments.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-600 font-medium">Aucun paiement récent</p>
              </div>
            ) : (
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {recentPayments.map((payment) => {
                        const username =
                          payment.utilisateur_username ||
                          payment.utilisateur_nom ||
                          payment.username ||
                          payment.user_username ||
                          (payment.utilisateur && (payment.utilisateur.username || payment.utilisateur.nom)) ||
                          `User #${payment.utilisateur_id || payment.user_id || payment.id || '-'}`;
                        const montant = payment.montant ?? payment.amount ?? 0;
                        const devise = payment.devise || 'TND';
                        const plan = payment.plan_nom || payment.plan || '-';
                        const statut = payment.statut || payment.status || '-';
                        return (
                          <tr key={payment.id || `${username}-${payment.created_at}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="font-semibold">{formatPrice(montant)}</span>
                              {devise && devise !== 'TND' && (
                                <span className="text-gray-400 ml-1">({devise})</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {plan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {getStatusBadge(statut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.created_at || payment.date)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFinances;
