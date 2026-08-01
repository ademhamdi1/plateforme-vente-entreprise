import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favorisService } from '../services/favorisService';
import { authService } from '../services/authService';
import './Favoris.css';

function Favoris() {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier que l'utilisateur est acheteur
    const userType = authService.getUserType();
    if (userType !== 'acheteur') {
      navigate('/dashboard');
      return;
    }

    // Charger les favoris depuis PostgreSQL
    loadFavoris();
  }, [navigate]);

  const loadFavoris = async () => {
    try {
      setLoading(true);
      // Charger depuis PostgreSQL
      const data = await favorisService.getFavoris();
      setFavoris(data);
    } catch (err) {
      console.error('Erreur chargement favoris:', err);
      setError('Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavori = async (slug) => {
    if (!window.confirm('Retirer cette entreprise de vos favoris ?')) {
      return;
    }

    try {
      setRemoving(slug);
      // Supprimer de PostgreSQL
      await favorisService.removeFavori(slug);
      
      // Mettre à jour l'état local
      setFavoris(favoris.filter(f => f.entreprise.slug !== slug));
    } catch (err) {
      console.error('Erreur suppression favori:', err);
      alert('Impossible de retirer le favori');
    } finally {
      setRemoving(null);
    }
  };

  const handleViewEntreprise = (slug) => {
    navigate(`/entreprises/${slug}`);
  };

  const toggleCompareSelection = (slug) => {
    if (selectedForComparison.includes(slug)) {
      setSelectedForComparison(selectedForComparison.filter(s => s !== slug));
    } else {
      if (selectedForComparison.length >= 4) {
        alert('Vous pouvez comparer jusqu\'à 4 entreprises maximum');
        return;
      }
      setSelectedForComparison([...selectedForComparison, slug]);
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      alert('Veuillez sélectionner au moins 2 entreprises à comparer');
      return;
    }
    navigate(`/comparateur?slugs=${selectedForComparison.join(',')}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSecteurLabel = (value) => {
    const secteurs = {
      'industrie': 'Industrie',
      'agriculture': 'Agriculture',
      'services': 'Services',
      'commerce': 'Commerce',
      'tourisme': 'Tourisme et hôtellerie',
      'transport': 'Transport et logistique',
      'sante': 'Santé',
      'informatique': 'Technologies de l\'information',
      'education': 'Éducation',
      'btp': 'BTP et construction',
      'franchise': 'Franchise',
      'startup': 'Startups',
      'autre': 'Autres',
    };
    return secteurs[value] || value;
  };

  const getRegionLabel = (value) => {
    return value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="favoris-page">
        <div className="container">
          <div className="loading">Chargement de vos favoris...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="favoris-page">
      <div className="container">
        <div className="favoris-header">
          <h1>⭐ Mes Favoris</h1>
          <p className="subtitle">
            {favoris.length} entreprise{favoris.length > 1 ? 's' : ''} sauvegardée{favoris.length > 1 ? 's' : ''}
          </p>
        </div>

        {favoris.length > 1 && (
          <div className="comparison-bar">
            <div className="comparison-info">
              <span className="comparison-count">
                {selectedForComparison.length} sélectionnée{selectedForComparison.length > 1 ? 's' : ''}
              </span>
              {selectedForComparison.length > 0 && (
                <button
                  className="btn-clear-selection"
                  onClick={() => setSelectedForComparison([])}
                >
                  ✕ Effacer
                </button>
              )}
            </div>
            <button
              className="btn btn-compare"
              onClick={handleCompare}
              disabled={selectedForComparison.length < 2}
            >
              📊 Comparer ({selectedForComparison.length}/4)
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {favoris.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>Aucun favori</h3>
            <p>
              Vous n'avez pas encore ajouté d'entreprises à vos favoris.
              Parcourez les annonces et cliquez sur l'icône ❤️ pour sauvegarder vos entreprises préférées.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/entreprises')}
            >
              Voir les entreprises
            </button>
          </div>
        ) : (
          <div className="favoris-grid">
            {favoris.map((favori) => {
              const entreprise = favori.entreprise;
              const isSelected = selectedForComparison.includes(entreprise.slug);
              return (
                <div 
                  key={favori.id} 
                  className={`favori-card ${isSelected ? 'selected-for-comparison' : ''}`}
                >
                  <div className="card-header">
                    <div className="header-left">
                      <input
                        type="checkbox"
                        className="compare-checkbox"
                        checked={isSelected}
                        onChange={() => toggleCompareSelection(entreprise.slug)}
                        title="Sélectionner pour comparer"
                      />
                      <h3 className="entreprise-nom">
                        {entreprise.nom_masque ? '🔒 Confidentielle' : entreprise.nom}
                      </h3>
                    </div>
                    <button
                      className="btn-remove-favori"
                      onClick={() => handleRemoveFavori(entreprise.slug)}
                      disabled={removing === entreprise.slug}
                      title="Retirer des favoris"
                    >
                      {removing === entreprise.slug ? '...' : '❤️'}
                    </button>
                  </div>

                  <div className="card-badges">
                    <span className="badge badge-primary">
                      {getSecteurLabel(entreprise.secteur)}
                    </span>
                    <span className="badge badge-secondary">
                      {getRegionLabel(entreprise.region)}
                    </span>
                  </div>

                  <p className="entreprise-description">
                    {entreprise.description?.substring(0, 150)}
                    {entreprise.description?.length > 150 ? '...' : ''}
                  </p>

                  <div className="entreprise-info">
                    <div className="info-item">
                      <span className="info-label">Prix</span>
                      <span className="info-value price">
                        {formatPrice(entreprise.prix_demande)}
                      </span>
                    </div>
                    {entreprise.chiffre_affaires && (
                      <div className="info-item">
                        <span className="info-label">CA</span>
                        <span className="info-value">
                          {formatPrice(entreprise.chiffre_affaires)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-meta">
                    <span className="date-added">
                      Ajouté le {formatDate(favori.created_at)}
                    </span>
                    <span className="views">👁️ {entreprise.nombre_vues}</span>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleViewEntreprise(entreprise.slug)}
                  >
                    Voir les détails
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoris;
