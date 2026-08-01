import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import adminService from '../services/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [entreprisesEnAttente, setEntreprisesEnAttente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refusModal, setRefusModal] = useState(null);
  const [raisonRefus, setRaisonRefus] = useState('');
  const [featuredModal, setFeaturedModal] = useState(null);
  const [dureeMiseEnAvant, setDureeMiseEnAvant] = useState(30);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load from PostgreSQL
      const [statsData, entreprises] = await Promise.all([
        adminService.getStatistiques(),
        adminService.getEntreprisesEnAttente(),
      ]);
      
      setStats(statsData);
      setEntreprisesEnAttente(Array.isArray(entreprises) ? entreprises : []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Erreur lors du chargement des données');
      
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

  const handleValider = async (slug) => {
    if (!window.confirm('Valider cette entreprise ?')) return;
    
    try {
      // Save to PostgreSQL
      await adminService.validerEntreprise(slug);
      alert('✅ Entreprise validée !');
      loadData(); // Reload data from PostgreSQL
    } catch (err) {
      console.error('Error validating:', err);
      alert('Erreur lors de la validation');
    }
  };

  const handleRefuserClick = (entreprise) => {
    setRefusModal(entreprise);
    setRaisonRefus('');
  };

  const handleRefuserSubmit = async () => {
    if (!raisonRefus.trim()) {
      alert('La raison du refus est obligatoire');
      return;
    }
    
    try {
      // Save to PostgreSQL
      await adminService.refuserEntreprise(refusModal.slug, raisonRefus);
      alert('✅ Entreprise refusée');
      setRefusModal(null);
      setRaisonRefus('');
      loadData(); // Reload data from PostgreSQL
    } catch (err) {
      console.error('Error refusing:', err);
      alert('Erreur lors du refus');
    }
  };

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>🛡️ Administration</h1>
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

        {/* Statistiques - From PostgreSQL */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_entreprises}</div>
              <div className="stat-label">Total Entreprises</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-number">{stats.entreprises_publiees}</div>
              <div className="stat-label">Publiées</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-number">{stats.entreprises_en_attente}</div>
              <div className="stat-label">En attente</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-number">{stats.entreprises_refusees}</div>
              <div className="stat-label">Refusées</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.total_vendeurs}</div>
              <div className="stat-label">Vendeurs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.total_acheteurs}</div>
              <div className="stat-label">Acheteurs</div>
            </div>
          </div>
        )}

        {/* Entreprises en attente - From PostgreSQL */}
        <div className="section">
          <div className="section-header">
            <h2>⏳ Entreprises en attente de validation</h2>
            <div className="admin-buttons">
              <button 
                onClick={() => navigate('/admin/entreprises-publiees')} 
                className="btn-admin-link"
              >
                ⭐ Gérer les entreprises publiées
              </button>
              <button 
                onClick={() => navigate('/admin/temoignages')} 
                className="btn-admin-link"
              >
                💬 Gérer les témoignages
              </button>
            </div>
          </div>
          
          {entreprisesEnAttente.length === 0 ? (
            <div className="empty-state">
              <p>✅ Aucune entreprise en attente</p>
            </div>
          ) : (
            <div className="entreprises-list">
              {entreprisesEnAttente.map((entreprise) => (
                <div key={entreprise.id} className="entreprise-card-admin">
                  <div className="card-content">
                    <h3>{entreprise.nom}</h3>
                    <p className="description">{entreprise.description.substring(0, 150)}...</p>
                    <div className="info-row">
                      <span>📍 {entreprise.ville}, {entreprise.region}</span>
                      <span>💰 {formatPrice(entreprise.prix_demande)}</span>
                    </div>
                    <div className="info-row">
                      <span>👤 {entreprise.vendeur_nom}</span>
                      <span>📅 {new Date(entreprise.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleValider(entreprise.slug)}
                    >
                      ✅ Valider
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleRefuserClick(entreprise)}
                    >
                      ❌ Refuser
                    </button>
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
        </div>

        {/* Modal Refus */}
        {refusModal && (
          <div className="modal-overlay" onClick={() => setRefusModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>❌ Refuser l'entreprise</h3>
              <p><strong>{refusModal.nom}</strong></p>
              <textarea
                value={raisonRefus}
                onChange={(e) => setRaisonRefus(e.target.value)}
                placeholder="Raison du refus (obligatoire)..."
                rows="4"
                className="modal-textarea"
              />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setRefusModal(null)}>
                  Annuler
                </button>
                <button className="btn btn-danger" onClick={handleRefuserSubmit}>
                  Confirmer le refus
                </button>
              </div>
            </div>
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

export default AdminDashboard;
