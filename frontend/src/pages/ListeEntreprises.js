import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { favorisService } from '../services/favorisService';
import { authService } from '../services/authService';
import './ListeEntreprises.css';

function ListeEntreprises() {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorisStatus, setFavorisStatus] = useState({});
  const [filters, setFilters] = useState({
    secteur: '',
    region: '',
    prix_min: '',
    prix_max: '',
    search: '',
  });

  const isAuthenticated = authService.isAuthenticated();
  const userType = authService.getUserType();

  // Fetch entreprises from PostgreSQL
  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await entrepriseService.getAll();
      // Ensure data is always an array
      setEntreprises(Array.isArray(data) ? data : []);
      
      // Load favoris status for acheteur
      if (isAuthenticated && userType === 'acheteur') {
        loadFavorisStatus(data);
      }
    } catch (err) {
      console.error('Error fetching entreprises:', err);
      setError('Erreur lors du chargement des entreprises');
      setEntreprises([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadFavorisStatus = async (entreprisesList) => {
    try {
      // Get all favoris at once
      const favoris = await favorisService.getFavoris();
      const status = {};
      
      // Create a map of favori slugs
      const favorisSlugs = favoris.map(f => f.entreprise?.slug).filter(Boolean);
      
      // Set status for all enterprises
      entreprisesList.forEach(ent => {
        status[ent.slug] = favorisSlugs.includes(ent.slug);
      });
      
      setFavorisStatus(status);
    } catch (err) {
      console.error('Error loading favoris status:', err);
    }
  };

  const handleToggleFavori = async (slug, e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      navigate('/login');
      return;
    }

    if (userType !== 'acheteur') {
      alert('Seuls les acheteurs peuvent ajouter des favoris');
      return;
    }

    try {
      if (favorisStatus[slug]) {
        // Remove from favoris
        await favorisService.removeFavori(slug);
        setFavorisStatus({ ...favorisStatus, [slug]: false });
      } else {
        // Add to favoris
        await favorisService.addFavori(slug);
        setFavorisStatus({ ...favorisStatus, [slug]: true });
      }
    } catch (err) {
      console.error('Error toggling favori:', err);
      alert('Erreur lors de la modification des favoris');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      secteur: '',
      region: '',
      prix_min: '',
      prix_max: '',
      search: '',
    });
  };

  // Filter entreprises
  const filteredEntreprises = entreprises.filter((ent) => {
    // Search filter
    if (filters.search && !ent.nom.toLowerCase().includes(filters.search.toLowerCase()) &&
        !ent.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // Secteur filter
    if (filters.secteur && ent.secteur !== filters.secteur) {
      return false;
    }
    // Region filter
    if (filters.region && ent.region !== filters.region) {
      return false;
    }
    // Prix min filter
    if (filters.prix_min && parseFloat(ent.prix_demande) < parseFloat(filters.prix_min)) {
      return false;
    }
    // Prix max filter
    if (filters.prix_max && parseFloat(ent.prix_demande) > parseFloat(filters.prix_max)) {
      return false;
    }
    return true;
  });

  const secteurs = [
    { value: 'industrie', label: 'Industrie' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'tourisme', label: 'Tourisme et hôtellerie' },
    { value: 'transport', label: 'Transport et logistique' },
    { value: 'sante', label: 'Santé' },
    { value: 'informatique', label: 'Technologies de l\'information' },
    { value: 'education', label: 'Éducation' },
    { value: 'btp', label: 'BTP et construction' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'startup', label: 'Startups' },
    { value: 'autre', label: 'Autres' },
  ];

  const regions = [
    'tunis', 'ariana', 'ben_arous', 'manouba', 'nabeul', 'zaghouan',
    'bizerte', 'beja', 'jendouba', 'le_kef', 'siliana', 'sousse',
    'monastir', 'mahdia', 'sfax', 'kairouan', 'kasserine', 'sidi_bouzid',
    'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili',
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSecteurLabel = (value) => {
    const secteur = secteurs.find(s => s.value === value);
    return secteur ? secteur.label : value;
  };

  const getRegionLabel = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="liste-page">
        <div className="container">
          <div className="loading">⏳ Chargement des entreprises...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="liste-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>🏢 Entreprises à vendre</h1>
          <p className="page-subtitle">
            {filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''} disponible{filteredEntreprises.length > 1 ? 's' : ''}
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Filters */}
        <div className="filters-section">
          <h2>🔍 Recherche avancée</h2>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Recherche</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom ou description..."
              />
            </div>

            <div className="filter-group">
              <label>Secteur</label>
              <select name="secteur" value={filters.secteur} onChange={handleFilterChange}>
                <option value="">Tous les secteurs</option>
                {secteurs.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Région</label>
              <select name="region" value={filters.region} onChange={handleFilterChange}>
                <option value="">Toutes les régions</option>
                {regions.map(r => (
                  <option key={r} value={r}>{getRegionLabel(r)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Prix min (TND)</label>
              <input
                type="number"
                name="prix_min"
                value={filters.prix_min}
                onChange={handleFilterChange}
                placeholder="Ex: 100000"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Prix max (TND)</label>
              <input
                type="number"
                name="prix_max"
                value={filters.prix_max}
                onChange={handleFilterChange}
                placeholder="Ex: 500000"
                min="0"
              />
            </div>
          </div>

          <button className="btn btn-secondary btn-reset" onClick={resetFilters}>
            🔄 Réinitialiser les filtres
          </button>
        </div>

        {/* Entreprises Grid */}
        {filteredEntreprises.length === 0 ? (
          <div className="no-results">
            <p>😔 Aucune entreprise ne correspond à vos critères</p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Voir toutes les entreprises
            </button>
          </div>
        ) : (
          <div className="entreprises-grid">
            {filteredEntreprises.map((entreprise) => (
              <div key={entreprise.id} className={`entreprise-card ${entreprise.est_mise_en_avant ? 'featured-card' : ''}`}>
                <div className="card-header">
                  <h3>
                    {entreprise.est_mise_en_avant && <span className="star-badge">⭐</span>}
                    {entreprise.nom_masque ? '🔒 Entreprise confidentielle' : entreprise.nom}
                  </h3>
                  <span className="badge badge-primary">{getSecteurLabel(entreprise.secteur)}</span>
                </div>

                <div className="card-body">
                  <p className="description">
                    {entreprise.description.length > 120
                      ? entreprise.description.substring(0, 120) + '...'
                      : entreprise.description}
                  </p>

                  <div className="card-info">
                    <div className="info-item">
                      <span className="info-label">📍 Localisation</span>
                      <span className="info-value">
                        {entreprise.adresse_masquee
                          ? getRegionLabel(entreprise.region)
                          : `${entreprise.ville}, ${getRegionLabel(entreprise.region)}`}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">💰 Prix demandé</span>
                      <span className="info-value price">{formatPrice(entreprise.prix_demande)}</span>
                    </div>

                    {entreprise.chiffre_affaires && (
                      <div className="info-item">
                        <span className="info-label">📊 CA annuel</span>
                        <span className="info-value">{formatPrice(entreprise.chiffre_affaires)}</span>
                      </div>
                    )}

                    {entreprise.nombre_employes !== null && (
                      <div className="info-item">
                        <span className="info-label">👥 Employés</span>
                        <span className="info-value">{entreprise.nombre_employes}</span>
                      </div>
                    )}

                    {entreprise.annee_creation && (
                      <div className="info-item">
                        <span className="info-label">📅 Créée en</span>
                        <span className="info-value">{entreprise.annee_creation}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-meta">
                    <span className="badge badge-secondary">{entreprise.type_transaction.replace(/_/g, ' ')}</span>
                    <span className="views">👁 {entreprise.nombre_vues} vues</span>
                  </div>
                </div>

                <div className="card-footer">
                  {isAuthenticated && userType === 'acheteur' && (
                    <button 
                      className={`btn-favori ${favorisStatus[entreprise.slug] ? 'favoris-active' : ''}`}
                      onClick={(e) => handleToggleFavori(entreprise.slug, e)}
                      title={favorisStatus[entreprise.slug] ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {favorisStatus[entreprise.slug] ? '❤️' : '🤍'}
                    </button>
                  )}
                  <button 
                    className="btn btn-primary btn-view"
                    onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                  >
                    👁️ Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeEntreprises;
