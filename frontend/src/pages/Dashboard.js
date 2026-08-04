import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mesEntreprises, setMesEntreprises] = useState([]);
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      // Get user profile from PostgreSQL
      const profile = await authService.getProfile();
      setUser(profile);

      // Redirect admin to admin dashboard
      if (profile.user_type === 'admin') {
        navigate('/admin');
        return;
      }

      // If vendeur, get their entreprises from PostgreSQL
      if (profile.user_type === 'vendeur') {
        try {
          const entreprises = await entrepriseService.getMesEntreprises();
          // Ensure entreprises is an array
          setMesEntreprises(Array.isArray(entreprises) ? entreprises : []);
        } catch (entrepriseError) {
          console.error('Error loading entreprises:', entrepriseError);
          // Set empty array if error
          setMesEntreprises([]);
        }
      }

      // If acheteur, load recommendations from PostgreSQL
      if (profile.user_type === 'acheteur') {
        try {
          const recoData = await entrepriseService.getRecommandations();
          setRecommandations(recoData.recommandations || []);
        } catch (recoError) {
          console.error('Error loading recommendations:', recoError);
          setRecommandations([]);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erreur lors du chargement des données');

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-base">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-danger-50 text-danger-700 border border-danger-200 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-8 animate-[fadeIn_0.5s_ease]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
          <p className="text-gray-600 text-base">
            Bienvenue, {user?.first_name || user?.username} !
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl shadow-card p-6 mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-block bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
              {user?.user_type === 'vendeur' ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Vendeur
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Acheteur
                </span>
              )}
            </span>
            <h2 className="text-xl font-bold mb-1">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm text-white/90 mb-1">{user?.email}</p>
            {user?.phone && (
              <p className="text-sm text-white/90 inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user?.phone}
              </p>
            )}
          </div>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold text-base hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-floating transition-all duration-300 self-start md:self-center cursor-pointer"
            onClick={() => navigate('/profil')}
            title="Modifier mon profil"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier mon profil
          </button>
        </div>

        {/* Vendeur Section */}
        {user?.user_type === 'vendeur' && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mes entreprises</h2>
              <button
                className="btn-primary"
                onClick={() => navigate('/publier')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Publier
              </button>
            </div>

            {mesEntreprises.length === 0 ? (
              <div className="empty-state">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-gray-600 mb-6 text-lg">
                  Vous n'avez pas encore publié d'entreprise
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/publier')}
                >
                  Publier ma première entreprise
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mesEntreprises.map((entreprise) => (
                  <div
                    key={entreprise.id}
                    className="bg-gray-50 p-4 rounded-xl border-l-4 border-primary-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 flex-1">{entreprise.nom}</h3>
                      {entreprise.statut === 'publiee' && (
                        <span className="badge-success">
                          Publiée
                        </span>
                      )}
                      {entreprise.statut === 'en_attente' && (
                        <span className="badge-warning">
                          En attente
                        </span>
                      )}
                      {entreprise.statut === 'brouillon' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                          Brouillon
                        </span>
                      )}
                      {entreprise.statut === 'refusee' && (
                        <span className="badge-danger">
                          Refusée
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-primary-600 mb-1">
                      {Number(entreprise.prix_demande).toLocaleString()} TND
                    </p>
                    <p className="text-gray-600 text-sm mb-2 inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {entreprise.region} - {entreprise.ville}
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {entreprise.nombre_vues} vues
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn-secondary !px-3 !py-2 !text-xs flex-1 md:!px-4 md:!py-2.5 md:!text-sm"
                        onClick={() => {
                          navigate(`/modifier/${entreprise.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-success-500 text-white font-semibold hover:bg-success-600 active:scale-95 transition-all duration-200 cursor-pointer border-none text-xs flex-1 md:px-4 md:py-2.5 md:text-sm"
                        onClick={() => {
                          navigate(`/statistiques/${entreprise.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Stats
                      </button>
                      <button
                        className="btn-primary !px-3 !py-2 !text-xs flex-1 md:!px-4 md:!py-2.5 md:!text-sm"
                        onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Acheteur Section */}
        {user?.user_type === 'acheteur' && (
          <>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-left text-base font-semibold text-gray-900 cursor-pointer transition-all duration-300 hover:border-primary-500 hover:bg-white hover:shadow-card"
                  onClick={() => navigate('/entreprises')}
                >
                  <span className="text-primary-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <span>Rechercher une entreprise</span>
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommandations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 inline-flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Recommandations pour vous
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Basées sur vos consultations et préférences
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                  {recommandations.slice(0, 6).map((entreprise) => (
                    <div
                      key={entreprise.id}
                      className="bg-white rounded-xl p-4 md:p-5 shadow-soft cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-floating border-l-4 border-primary-500"
                      onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <h3 className="text-base font-semibold text-gray-900 flex-1">
                          {entreprise.nom_masque ? (
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Confidentielle
                            </span>
                          ) : entreprise.nom}
                        </h3>
                        {entreprise.mise_en_avant && (
                          <span className="flex-shrink-0">
                            <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {entreprise.secteur_display && (
                          <span className="badge-primary">{entreprise.secteur_display}</span>
                        )}
                        {entreprise.region_display && (
                          <span className="badge-primary">{entreprise.region_display}</span>
                        )}
                      </div>
                      <div className="text-lg md:text-xl font-bold text-success-600 mb-2.5">
                        {new Intl.NumberFormat('fr-TN', {
                          style: 'currency',
                          currency: 'TND',
                          minimumFractionDigits: 0,
                        }).format(entreprise.prix)}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed m-0">
                        {entreprise.description?.substring(0, 80)}
                        {entreprise.description?.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
