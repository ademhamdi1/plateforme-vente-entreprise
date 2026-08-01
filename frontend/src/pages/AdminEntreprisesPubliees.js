import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import adminService from '../services/adminService';
import './AdminEntreprisesPubliees.css';

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
      alert(`✅ Entreprise mise en avant pour ${dureeMiseEnAvant} jours !`);
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
      alert('✅ Mise en avant retirée !');
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
      <div className="admin-entreprises-publiees">
        <div className="container">
          <div className="loading">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-entreprises-publiees">
      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <button 
              onClick={() => navigate('/admin')} 
              className="btn-back"
            >
              ← Retour au dashboard
            </button>
            <h1>⭐ Gérer les entreprises publiées</h1>
          </div>
          <a 
            href="http://localhost:8000/admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-django-admin"
          >
            🔧 Django Admin
          </a>
        </div>
        
        {error && <div className="error">{error}</div>}

        {entreprises.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucune entreprise publiée</p>
          </div>
        ) : (
          <div className="entreprises-list">
            {entreprises.map((entreprise) => (
              <div key={entreprise.id} className="entreprise-card-admin">
                <div className="card-content">
                  <div className="card-header-row">
                    <h3>{entreprise.nom}</h3>
                    {entreprise.est_mise_en_avant && (
                      <span className="badge-featured">⭐ En avant</span>
                    )}
                  </div>
                  <p className="description">{entreprise.description.substring(0, 150)}...</p>
                  <div className="info-row">
                    <span>📍 {entreprise.ville}, {entreprise.region}</span>
                    <span>💰 {formatPrice(entreprise.prix_demande)}</span>
                  </div>
                  <div className="info-row">
                    <span>👤 {entreprise.vendeur_nom}</span>
                    <span>📅 Publié: {formatDate(entreprise.published_at)}</span>
                  </div>
                  {entreprise.est_mise_en_avant && (
                    <div className="info-row featured-dates">
                      <span>🗓️ Début: {formatDate(entreprise.date_debut_mise_en_avant)}</span>
                      <span>🗓️ Fin: {formatDate(entreprise.date_fin_mise_en_avant)}</span>
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  {entreprise.est_mise_en_avant ? (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleRetirerMiseEnAvant(entreprise.slug)}
                    >
                      ❌ Retirer mise en avant
                    </button>
                  ) : (
                    <button 
                      className="btn btn-warning"
                      onClick={() => handleMettreEnAvantClick(entreprise)}
                    >
                      ⭐ Mettre en avant
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                  >
                    👁️ Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Mise en Avant */}
        {featuredModal && (
          <div className="modal-overlay" onClick={() => setFeaturedModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>⭐ Mettre en avant l'entreprise</h3>
              <p><strong>{featuredModal.nom}</strong></p>
              <div className="form-group">
                <label htmlFor="duree">Durée de mise en avant</label>
                <select
                  id="duree"
                  value={dureeMiseEnAvant}
                  onChange={(e) => setDureeMiseEnAvant(Number(e.target.value))}
                  className="modal-select"
                >
                  <option value={7}>7 jours</option>
                  <option value={15}>15 jours</option>
                  <option value={30}>30 jours (recommandé)</option>
                  <option value={60}>60 jours</option>
                  <option value={90}>90 jours</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setFeaturedModal(null)}>
                  Annuler
                </button>
                <button className="btn btn-warning" onClick={handleMettreEnAvantSubmit}>
                  ⭐ Confirmer
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
