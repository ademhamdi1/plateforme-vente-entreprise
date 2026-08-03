import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statistiquesService } from '../services/statistiquesService';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';

function Statistiques() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [entreprise, setEntreprise] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periode, setPeriode] = useState('30'); // 7, 30 jours

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier que l'utilisateur est vendeur
    const userType = authService.getUserType();
    if (userType !== 'vendeur') {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [slug, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger l'entreprise et stats depuis PostgreSQL
      const [entrepriseData, statsData] = await Promise.all([
        entrepriseService.getBySlug(slug),
        statistiquesService.getStatistiquesEntreprise(slug)
      ]);

      setEntreprise(entrepriseData);
      setStats(statsData);

    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const formatDuree = (secondes) => {
    if (secondes < 60) return `${secondes}s`;
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes}m ${secs}s`;
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key] || 0), 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            Chargement des statistiques...
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 my-4">
            {error || 'Impossible de charger les statistiques'}
          </div>
        </div>
      </div>
    );
  }

  const vuesData = periode === '7'
    ? stats.vues_par_jour.slice(-7)
    : stats.vues_par_jour;

  const maxVues = getMaxValue(vuesData, 'nombre_vues');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques
          </h1>
          <p className="text-gray-600 mt-2">{entreprise?.nom}</p>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total_vues}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">Vues totales</div>
            <div className="text-xs text-gray-500 mt-1">{stats.vues_7_jours} cette semaine</div>
          </div>

          <div className="card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total_contacts}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">Contacts</div>
            <div className="text-xs text-gray-500 mt-1">{stats.contacts_7_jours} cette semaine</div>
          </div>

          <div className="card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.taux_conversion_moyen}%</div>
            <div className="text-sm font-medium text-gray-700 mt-1">Taux de conversion</div>
            <div className="text-xs text-gray-500 mt-1">Vue &rarr; Contact</div>
          </div>

          <div className="card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{formatDuree(stats.temps_moyen_page)}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">Temps moyen</div>
            <div className="text-xs text-gray-500 mt-1">Sur la page</div>
          </div>
        </div>

        {/* Actions supplémentaires */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card flex items-center justify-center gap-3 py-4">
            <span className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-gray-900">{stats.total_favoris}</span>
            <span className="text-sm text-gray-600">Favoris</span>
          </div>
          <div className="card flex items-center justify-center gap-3 py-4">
            <span className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-gray-900">{stats.total_partages}</span>
            <span className="text-sm text-gray-600">Partages</span>
          </div>
        </div>

        {/* Graphique Vues */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Évolution des vues</h2>
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-100">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  periode === '7'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setPeriode('7')}
              >
                7 jours
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  periode === '30'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setPeriode('30')}
              >
                30 jours
              </button>
            </div>
          </div>

          <div className="w-full">
            {vuesData.length > 0 ? (
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-64 overflow-x-auto">
                {vuesData.map((item, index) => {
                  const height = (item.nombre_vues / maxVues) * 100;
                  const date = new Date(item.date);
                  const dateStr = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 min-w-[24px]">
                      <div className="w-full flex items-end justify-center h-56">
                        <div
                          className="w-full max-w-[40px] bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md flex items-start justify-center pt-1 transition-all hover:from-primary-600 hover:to-primary-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.nombre_vues} vues le ${dateStr}`}
                        >
                          <span className="text-xs font-semibold text-white">{item.nombre_vues}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">{dateStr}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state text-gray-500">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Pas encore de données
              </div>
            )}
          </div>
        </div>

        {/* Graphique Taux de conversion */}
        {stats.conversions_par_jour.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Taux de conversion</h2>
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {stats.conversions_par_jour.slice(-7).map((item, index) => {
                  const date = new Date(item.date);
                  const dateStr = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <div className="text-lg font-bold text-primary-600">{item.taux_conversion}%</div>
                      <div className="text-xs text-gray-600 mt-1">{dateStr}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.nombre_contacts}/{item.nombre_vues}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Actions récentes */}
        {stats.actions_recentes.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
            <div className="divide-y divide-gray-100">
              {stats.actions_recentes.slice(0, 10).map((action, index) => {
                const date = new Date(action.created_at);
                const timeStr = date.toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                const iconMap = {
                  'vue': (
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ),
                  'contact': (
                    <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  'favori': (
                    <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  'partage': (
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  ),
                  'document': (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  'image': (
                    <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                };

                return (
                  <div key={index} className="flex items-center gap-3 py-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {iconMap[action.action]}
                    </span>
                    <span className="flex-1 text-sm text-gray-800">{action.action_display}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistiques;
