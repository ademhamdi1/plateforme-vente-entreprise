import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { temoignageService } from '../services/temoignageService';
import { toast } from 'react-toastify';

function AdminTemoignages() {
  const navigate = useNavigate();
  const [temoignages, setTemoignages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('en_attente'); // en_attente, publies, all

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [filter, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [temoignagesData, statsData] = await Promise.all([
        temoignageService.getAdminTemoignages(filter === 'all' ? null : filter),
        temoignageService.getStatsTemoignages(),
      ]);
      setTemoignages(temoignagesData || []);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur chargement témoignages:', err);
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handlePublier = async (id) => {
    if (!window.confirm('Voulez-vous publier ce témoignage ?')) {
      return;
    }

    try {
      await temoignageService.publierTemoignage(id);
      toast.success('Témoignage publié avec succès');
      loadData();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors de la publication');
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce témoignage ? Cette action est irréversible.')) {
      return;
    }

    try {
      await temoignageService.supprimerTemoignage(id);
      toast.success('Témoignage supprimé');
      loadData();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors de la suppression');
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="h-7 w-7 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Gestion des Témoignages
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
          <a
            href="http://localhost:8000/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 active:scale-95 transition-all duration-200"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
            Django Admin
          </a>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-success-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-success-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.publies}</div>
                <div className="text-sm text-gray-500">Publiés</div>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-warning-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-warning-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.en_attente}</div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.note_moyenne.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Note moyenne</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              filter === 'en_attente'
                ? 'bg-warning-500 text-white hover:bg-warning-600'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('en_attente')}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            En attente ({stats?.en_attente || 0})
          </button>
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              filter === 'publies'
                ? 'bg-success-500 text-white hover:bg-success-600'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('publies')}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Publiés ({stats?.publies || 0})
          </button>
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              filter === 'all'
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('all')}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Tous ({stats?.total || 0})
          </button>
        </div>

        {/* Témoignages List */}
        {temoignages.length === 0 ? (
          <div className="empty-state">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun témoignage</h3>
            <p className="text-gray-600">
              {filter === 'en_attente' && 'Aucun témoignage en attente de validation'}
              {filter === 'publies' && 'Aucun témoignage publié'}
              {filter === 'all' && 'Aucun témoignage dans la base de données'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {temoignages.map((temoignage) => (
              <div key={temoignage.id} className="card">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex flex-col gap-1">
                    <strong className="text-gray-900">{temoignage.utilisateur_nom}</strong>
                    <span className="text-sm text-gray-500">{temoignage.utilisateur_email}</span>
                    <span className={`badge ${temoignage.user_type === 'vendeur' ? 'badge-primary' : 'badge-warning'} w-fit`}>
                      {temoignage.user_type === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                    </span>
                  </div>
                  <div>
                    {temoignage.est_publie ? (
                      <span className="badge-success">
                        <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Publié
                      </span>
                    ) : (
                      <span className="badge-warning">
                        <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        En attente
                      </span>
                    )}
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-warning-500 text-lg tracking-wide" aria-label={`Note ${temoignage.note} sur 5`}>
                    {'★'.repeat(temoignage.note)}{'☆'.repeat(5 - temoignage.note)}
                  </span>
                  <span className="text-sm text-gray-500">({temoignage.note}/5)</span>
                </div>

                {/* Contenu */}
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {temoignage.contenu}
                </p>

                {/* Entreprise concernée */}
                {temoignage.entreprise_concernee && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg p-2">
                    <svg className="h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Entreprise: {temoignage.entreprise_concernee}
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {new Date(temoignage.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div className="flex gap-2">
                    {!temoignage.est_publie && (
                      <button
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-success-500 text-white text-sm font-semibold hover:bg-success-600 active:scale-95 transition-all duration-200"
                        onClick={() => handlePublier(temoignage.id)}
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Publier
                      </button>
                    )}
                    <button
                      className="btn-danger inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                      onClick={() => handleSupprimer(temoignage.id)}
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTemoignages;
