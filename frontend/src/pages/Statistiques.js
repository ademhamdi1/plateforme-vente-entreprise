import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statistiquesService } from '../services/statistiquesService';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';
import './Statistiques.css';

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
      <div className="statistiques-page">
        <div className="container">
          <div className="loading">Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="statistiques-page">
        <div className="container">
          <div className="error">{error || 'Impossible de charger les statistiques'}</div>
        </div>
      </div>
    );
  }

  const vuesData = periode === '7' 
    ? stats.vues_par_jour.slice(-7) 
    : stats.vues_par_jour;

  const maxVues = getMaxValue(vuesData, 'nombre_vues');

  return (
    <div className="statistiques-page">
      <div className="container">
        {/* Header */}
        <div className="stats-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Retour
          </button>
          <h1>📊 Statistiques</h1>
          <p className="subtitle">{entreprise?.nom}</p>
        </div>

        {/* KPIs principaux */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">👁️</div>
            <div className="kpi-value">{stats.total_vues}</div>
            <div className="kpi-label">Vues totales</div>
            <div className="kpi-sublabel">{stats.vues_7_jours} cette semaine</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">📧</div>
            <div className="kpi-value">{stats.total_contacts}</div>
            <div className="kpi-label">Contacts</div>
            <div className="kpi-sublabel">{stats.contacts_7_jours} cette semaine</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">📈</div>
            <div className="kpi-value">{stats.taux_conversion_moyen}%</div>
            <div className="kpi-label">Taux de conversion</div>
            <div className="kpi-sublabel">Vue → Contact</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">⏱️</div>
            <div className="kpi-value">{formatDuree(stats.temps_moyen_page)}</div>
            <div className="kpi-label">Temps moyen</div>
            <div className="kpi-sublabel">Sur la page</div>
          </div>
        </div>

        {/* Actions supplémentaires */}
        <div className="actions-grid">
          <div className="action-item">
            <span className="action-icon">⭐</span>
            <span className="action-value">{stats.total_favoris}</span>
            <span className="action-label">Favoris</span>
          </div>
          <div className="action-item">
            <span className="action-icon">🔗</span>
            <span className="action-value">{stats.total_partages}</span>
            <span className="action-label">Partages</span>
          </div>
        </div>

        {/* Graphique Vues */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>Évolution des vues</h2>
            <div className="chart-controls">
              <button 
                className={`btn-period ${periode === '7' ? 'active' : ''}`}
                onClick={() => setPeriode('7')}
              >
                7 jours
              </button>
              <button 
                className={`btn-period ${periode === '30' ? 'active' : ''}`}
                onClick={() => setPeriode('30')}
              >
                30 jours
              </button>
            </div>
          </div>

          <div className="chart-container">
            {vuesData.length > 0 ? (
              <div className="bar-chart">
                {vuesData.map((item, index) => {
                  const height = (item.nombre_vues / maxVues) * 100;
                  const date = new Date(item.date);
                  const dateStr = date.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                  });
                  
                  return (
                    <div key={index} className="bar-item">
                      <div className="bar-wrapper">
                        <div 
                          className="bar" 
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.nombre_vues} vues le ${dateStr}`}
                        >
                          <span className="bar-value">{item.nombre_vues}</span>
                        </div>
                      </div>
                      <div className="bar-label">{dateStr}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-chart">Pas encore de données</div>
            )}
          </div>
        </div>

        {/* Graphique Taux de conversion */}
        {stats.conversions_par_jour.length > 0 && (
          <div className="chart-section">
            <h2>Taux de conversion</h2>
            <div className="chart-container">
              <div className="line-chart">
                {stats.conversions_par_jour.slice(-7).map((item, index) => {
                  const date = new Date(item.date);
                  const dateStr = date.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                  });
                  
                  return (
                    <div key={index} className="line-item">
                      <div className="line-value">{item.taux_conversion}%</div>
                      <div className="line-label">{dateStr}</div>
                      <div className="line-detail">
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
          <div className="recent-section">
            <h2>Activité récente</h2>
            <div className="activity-list">
              {stats.actions_recentes.slice(0, 10).map((action, index) => {
                const date = new Date(action.created_at);
                const timeStr = date.toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                const icons = {
                  'vue': '👁️',
                  'contact': '📧',
                  'favori': '⭐',
                  'partage': '🔗',
                  'document': '📄',
                  'image': '🖼️'
                };
                
                return (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">{icons[action.action]}</span>
                    <span className="activity-text">{action.action_display}</span>
                    <span className="activity-time">{timeStr}</span>
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
