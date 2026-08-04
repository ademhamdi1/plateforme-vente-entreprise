import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import adminService from '../services/adminService';

function AdminEntreprisesPubliees() {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredModal, setFeaturedModal] = useState(null);
  const [dureeMiseEnAvant, setDureeMiseEnAvant] = useState(30);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Load from PostgreSQL
      const data = await adminService.getEntreprisesPubliees();
      setEntreprises(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading published enterprises:', err);
      setError('Erreur lors du chargement des entreprises');

      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is admin
    const userType = authService.getUserType();
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const handleMettreEnAvantClick = (entreprise) => {
    setFeaturedModal(entreprise);
    setDureeMiseEnAvant(30);
  };

  const handleMettreEnAvantSubmit = async () => {
    try {
      // Save to PostgreSQL
      await adminService.mettreEnAvant(featuredModal.slug, dureeMiseEnAvant);
      alert(`Entreprise mise en avant pour ${dureeMiseEnAvant} jours !`);
      setFeaturedModal(null);
      loadData(); // Reload data from PostgreSQL
    } catch (err) {
      console.error('Error featuring:', err);
      alert('Erreur lors de la mise en avant');
    }
  };

  const handleRetirerMiseEnAvant = async (slug) => {
    if (!window.confirm('Retirer la mise en avant de cette entreprise ?')) return;

    try {
      // Save to PostgreSQL
      await adminService.retirerMiseEnAvant(slug);
      alert('Mise en avant retirée !');
      loadData(); // Reload data from PostgreSQL
    } catch (err) {
      console.error('Error removing featured:', err);
      alert('Erreur lors du retrait');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-primary-600 border-2 border-primary-500 font-semibold hover:bg-primary-50 active:scale-95 transition-all duration-200 w-fit"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour au dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="h-7 w-7 text-warning-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Gérer les entreprises publiées
            </h1>
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

        {error && (
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {entreprises.length === 0 ? (
          <div className="empty-state">
            <svg className="h-12 w-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-gray-600 font-medium">Aucune entreprise publiée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {entreprises.map((entreprise) => (
              <div key={entreprise.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{entreprise.nom}</h3>
                    {entreprise.est_mise_en_avant && (
                      <span className="badge-warning whitespace-nowrap">
                        <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        En avant
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{entreprise.description.substring(0, 150)}...</p>
                  <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {entreprise.ville}, {entreprise.region}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                      <svg className="h-4 w-4 text-success-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatPrice(entreprise.prix_demande)}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      {entreprise.vendeur_nom}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Publié: {formatDate(entreprise.published_at)}
                    </span>
                  </div>
                  {entreprise.est_mise_en_avant && (
                    <div className="flex flex-wrap justify-between gap-2 text-sm text-warning-700 bg-warning-50 rounded-lg p-2 mt-2">
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-4 w-4 text-warning-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Début: {formatDate(entreprise.date_debut_mise_en_avant)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-4 w-4 text-warning-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Fin: {formatDate(entreprise.date_fin_mise_en_avant)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
                  {entreprise.est_mise_en_avant ? (
                    <button
                      className="btn-danger inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm"
                      onClick={() => handleRetirerMiseEnAvant(entreprise.slug)}
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Retirer mise en avant
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-warning-500 text-white text-sm font-semibold hover:bg-warning-600 active:scale-95 transition-all duration-200"
                      onClick={() => handleMettreEnAvantClick(entreprise)}
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      Mettre en avant
                    </button>
                  )}
                  <button
                    className="btn-secondary inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm"
                    onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Mise en Avant */}
        {featuredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setFeaturedModal(null)}>
            <div className="bg-white rounded-2xl shadow-floating max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="h-6 w-6 text-warning-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Mettre en avant l'entreprise
              </h3>
              <p className="mb-4 text-gray-700"><strong>{featuredModal.nom}</strong></p>
              <div className="mb-4">
                <label htmlFor="duree" className="label">Durée de mise en avant</label>
                <select
                  id="duree"
                  value={dureeMiseEnAvant}
                  onChange={(e) => setDureeMiseEnAvant(Number(e.target.value))}
                  className="input"
                >
                  <option value={7}>7 jours</option>
                  <option value={15}>15 jours</option>
                  <option value={30}>30 jours (recommandé)</option>
                  <option value={60}>60 jours</option>
                  <option value={90}>90 jours</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn-secondary" onClick={() => setFeaturedModal(null)}>
                  Annuler
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-warning-500 text-white font-semibold hover:bg-warning-600 active:scale-95 transition-all duration-200"
                  onClick={handleMettreEnAvantSubmit}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEntreprisesPubliees;
