import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { temoignageService } from '../services/temoignageService';
import { toast } from 'react-toastify';
import './AdminTemoignages.css';

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
      <div className="admin-temoignages-page">
        <div className="admin-container">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-temoignages-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-left">
            <h1>💬 Gestion des Témoignages</h1>
            <button onClick={() => navigate('/admin')} className="btn-back">
              ← Retour Dashboard
            </button>
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

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{stats.publies}</div>
                <div className="stat-label">Publiés</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{stats.en_attente}</div>
                <div className="stat-label">En attente</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{stats.note_moyenne.toFixed(1)}</div>
                <div className="stat-label">Note moyenne</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <button
            className={`filter-btn ${filter === 'en_attente' ? 'active' : ''}`}
            onClick={() => setFilter('en_attente')}
          >
            ⏳ En attente ({stats?.en_attente || 0})
          </button>
          <button
            className={`filter-btn ${filter === 'publies' ? 'active' : ''}`}
            onClick={() => setFilter('publies')}
          >
            ✅ Publiés ({stats?.publies || 0})
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📋 Tous ({stats?.total || 0})
          </button>
        </div>

        {/* Témoignages List */}
        {temoignages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Aucun témoignage</h3>
            <p>
              {filter === 'en_attente' && 'Aucun témoignage en attente de validation'}
              {filter === 'publies' && 'Aucun témoignage publié'}
              {filter === 'all' && 'Aucun témoignage dans la base de données'}
            </p>
          </div>
        ) : (
          <div className="temoignages-list">
            {temoignages.map((temoignage) => (
              <div key={temoignage.id} className="temoignage-admin-card">
                <div className="temoignage-header">
                  <div className="temoignage-user-info">
                    <strong>{temoignage.utilisateur_nom}</strong>
                    <span className="user-email">{temoignage.utilisateur_email}</span>
                    <span className="user-type-badge">
                      {temoignage.user_type === 'vendeur' ? '🏢 Vendeur' : '💼 Acheteur'}
                    </span>
                  </div>
                  <div className="temoignage-status">
                    {temoignage.est_publie ? (
                      <span className="badge-publie">✓ Publié</span>
                    ) : (
                      <span className="badge-attente">⏳ En attente</span>
                    )}
                  </div>
                </div>

                <div className="temoignage-stars">
                  {'★'.repeat(temoignage.note)}{'☆'.repeat(5 - temoignage.note)}
                  <span className="note-text">({temoignage.note}/5)</span>
                </div>

                <p className="temoignage-contenu">
                  {temoignage.contenu}
                </p>

                {temoignage.entreprise_concernee && (
                  <div className="temoignage-entreprise">
                    📍 Entreprise: {temoignage.entreprise_concernee}
                  </div>
                )}

                <div className="temoignage-footer">
                  <span className="temoignage-date">
                    {new Date(temoignage.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div className="temoignage-actions">
                    {!temoignage.est_publie && (
                      <button
                        className="btn-action btn-publier"
                        onClick={() => handlePublier(temoignage.id)}
                      >
                        ✓ Publier
                      </button>
                    )}
                    <button
                      className="btn-action btn-supprimer"
                      onClick={() => handleSupprimer(temoignage.id)}
                    >
                      🗑️ Supprimer
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
