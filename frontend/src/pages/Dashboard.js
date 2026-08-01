import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';
import './Dashboard.css';

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
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user?.first_name || user?.username} !</p>
        </div>

        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-info">
            <span className="user-badge">
              {user?.user_type === 'vendeur' ? '🏢 Vendeur' : '👤 Acheteur'}
            </span>
            <h2>{user?.first_name} {user?.last_name}</h2>
            <p>{user?.email}</p>
            {user?.phone && <p>📞 {user?.phone}</p>}
          </div>
          <button 
            className="btn-edit-profile"
            onClick={() => navigate('/profil')}
            title="Modifier mon profil"
          >
            ✏️ Modifier mon profil
          </button>
        </div>

        {/* Vendeur Section */}
        {user?.user_type === 'vendeur' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Mes entreprises</h2>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/publier')}
              >
                + Publier
              </button>
            </div>

            {mesEntreprises.length === 0 ? (
              <div className="empty-state">
                <p>📋 Vous n'avez pas encore publié d'entreprise</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/publier')}
                >
                  Publier ma première entreprise
                </button>
              </div>
            ) : (
              <div className="entreprises-grid">
                {mesEntreprises.map((entreprise) => (
                  <div key={entreprise.id} className="entreprise-card-mini">
                    <div className="card-header">
                      <h3>{entreprise.nom}</h3>
                      <span className={`status-badge ${entreprise.statut}`}>
                        {entreprise.statut === 'publiee' && '✅ Publiée'}
                        {entreprise.statut === 'en_attente' && '⏳ En attente'}
                        {entreprise.statut === 'brouillon' && '📝 Brouillon'}
                        {entreprise.statut === 'refusee' && '❌ Refusée'}
                      </span>
                    </div>
                    <p className="price">{Number(entreprise.prix_demande).toLocaleString()} TND</p>
                    <p className="location">📍 {entreprise.region} - {entreprise.ville}</p>
                    <div className="stats">
                      <span>👁️ {entreprise.nombre_vues} vues</span>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          navigate(`/modifier/${entreprise.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        className="btn btn-success btn-small"
                        onClick={() => {
                          navigate(`/statistiques/${entreprise.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        📊 Stats
                      </button>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                      >
                        👁️ Voir
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
            <div className="dashboard-section">
              <h2>Actions rapides</h2>
              <div className="quick-actions">
                <button 
                  className="action-card"
                  onClick={() => navigate('/entreprises')}
                >
                  <span className="action-icon">🔍</span>
                  <span>Rechercher une entreprise</span>
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommandations.length > 0 && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>💡 Recommandations pour vous</h2>
                  <p className="section-subtitle">
                    Basées sur vos consultations et préférences
                  </p>
                </div>
                <div className="recommandations-grid">
                  {recommandations.slice(0, 6).map((entreprise) => (
                    <div
                      key={entreprise.id}
                      className="recommandation-card"
                      onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                    >
                      <div className="reco-header">
                        <h3>{entreprise.nom_masque ? '🔒 Confidentielle' : entreprise.nom}</h3>
                        {entreprise.mise_en_avant && (
                          <span className="badge-featured">⭐</span>
                        )}
                      </div>
                      <div className="reco-badges">
                        <span className="badge">{entreprise.secteur_display}</span>
                        <span className="badge">{entreprise.region_display}</span>
                      </div>
                      <div className="reco-price">
                        {new Intl.NumberFormat('fr-TN', {
                          style: 'currency',
                          currency: 'TND',
                          minimumFractionDigits: 0,
                        }).format(entreprise.prix)}
                      </div>
                      <p className="reco-description">
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
