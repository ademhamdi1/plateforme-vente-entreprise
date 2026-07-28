import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EntrepriseService from '../../services/entreprise.service';
import AuthService from '../../services/auth.service';
import './Entreprise.css';

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedEntreprises, setSavedEntreprises] = useState([]);
  const [savedIds, setSavedIds] = useState(new Map());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    secteur: '',
    region: '',
    prix_min: '',
    prix_max: '',
    ca_min: '',
    ca_max: '',
    resultat_min: '',
    resultat_max: '',
    employes_min: '',
    employes_max: '',
    annee_min: '',
    type_transaction: '',
  });

  useEffect(() => {
    fetchEntreprises();
    setIsAuthenticated(AuthService.isAuthenticated());
    if (AuthService.isAuthenticated()) {
      loadFavorites();
    }
  }, [filters]);

  const loadFavorites = async () => {
    try {
      const favorites = await EntrepriseService.getFavorites();
      const favList = favorites.results || favorites;
      setSavedEntreprises(favList);
      
      // Create a map of entreprise_id -> saved_id for easy lookup
      const idMap = new Map();
      favList.forEach(saved => {
        idMap.set(saved.entreprise.id, saved.id);
      });
      setSavedIds(idMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const fetchEntreprises = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.secteur) params.secteur = filters.secteur;
      if (filters.region) params.region = filters.region;
      if (filters.prix_min) params.prix_min = filters.prix_min;
      if (filters.prix_max) params.prix_max = filters.prix_max;
      if (filters.ca_min) params.ca_min = filters.ca_min;
      if (filters.ca_max) params.ca_max = filters.ca_max;
      if (filters.resultat_min) params.resultat_min = filters.resultat_min;
      if (filters.resultat_max) params.resultat_max = filters.resultat_max;
      if (filters.employes_min) params.employes_min = filters.employes_min;
      if (filters.employes_max) params.employes_max = filters.employes_max;
      if (filters.annee_min) params.annee_min = filters.annee_min;
      if (filters.type_transaction) params.type_transaction = filters.type_transaction;

      const data = await EntrepriseService.getAll(params);
      setEntreprises(data.results || data);
    } catch (error) {
      console.error('Error fetching entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleFavorite = async (entrepriseId) => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour sauvegarder des favoris');
      return;
    }

    try {
      const savedId = savedIds.get(entrepriseId);
      
      if (savedId) {
        // Remove from favorites - use the saved_id
        await EntrepriseService.removeFavorite(savedId);
        const newMap = new Map(savedIds);
        newMap.delete(entrepriseId);
        setSavedIds(newMap);
        toast.success('Retiré des favoris');
      } else {
        // Add to favorites
        const response = await EntrepriseService.addFavorite(entrepriseId);
        const newMap = new Map(savedIds);
        newMap.set(entrepriseId, response.id);
        setSavedIds(newMap);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const isFavorite = (entrepriseId) => {
    return savedIds.has(entrepriseId);
  };

  const navigate = useNavigate();

  const handleToggleComparison = (entrepriseId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(entrepriseId)) {
        return prev.filter(id => id !== entrepriseId);
      } else {
        if (prev.length >= 4) {
          toast.warning('Vous pouvez comparer maximum 4 entreprises');
          return prev;
        }
        return [...prev, entrepriseId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      toast.warning('Sélectionnez au moins 2 entreprises à comparer');
      return;
    }
    navigate(`/comparison?ids=${selectedForComparison.join(',')}`);
  };

  return (
    <div className="entreprise-list-page">
      <div className="container">
        <h1>Entreprises à vendre en Tunisie</h1>
        <p className="subtitle">Trouvez l'entreprise idéale parmi {entreprises.length} opportunités</p>

        {selectedForComparison.length > 0 && (
          <div className="comparison-bar">
            <span>{selectedForComparison.length} entreprise(s) sélectionnée(s) pour comparaison</span>
            <button 
              className="btn btn-comparison" 
              onClick={handleCompare}
              disabled={selectedForComparison.length < 2}
            >
              Comparer ({selectedForComparison.length})
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSelectedForComparison([])}
            >
              Annuler
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <h3>Recherche avancée</h3>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Recherche</label>
              <input
                type="text"
                name="search"
                placeholder="Nom, description..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Secteur</label>
              <select name="secteur" value={filters.secteur} onChange={handleFilterChange}>
                <option value="">Tous les secteurs</option>
                <option value="industrie">Industrie</option>
                <option value="agriculture">Agriculture</option>
                <option value="services">Services</option>
                <option value="commerce">Commerce</option>
                <option value="tourisme">Tourisme et hôtellerie</option>
                <option value="transport">Transport et logistique</option>
                <option value="sante">Santé</option>
                <option value="informatique">Informatique et technologie</option>
                <option value="education">Éducation et formation</option>
                <option value="btp">BTP et construction</option>
                <option value="franchise">Franchise</option>
                <option value="startup">Startup</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Région</label>
              <select name="region" value={filters.region} onChange={handleFilterChange}>
                <option value="">Toutes les régions</option>
                <option value="tunis">Tunis</option>
                <option value="ariana">Ariana</option>
                <option value="ben_arous">Ben Arous</option>
                <option value="manouba">Manouba</option>
                <option value="nabeul">Nabeul</option>
                <option value="zaghouan">Zaghouan</option>
                <option value="bizerte">Bizerte</option>
                <option value="beja">Béja</option>
                <option value="jendouba">Jendouba</option>
                <option value="le_kef">Le Kef</option>
                <option value="siliana">Siliana</option>
                <option value="sousse">Sousse</option>
                <option value="monastir">Monastir</option>
                <option value="mahdia">Mahdia</option>
                <option value="sfax">Sfax</option>
                <option value="kairouan">Kairouan</option>
                <option value="kasserine">Kasserine</option>
                <option value="sidi_bouzid">Sidi Bouzid</option>
                <option value="gabes">Gabès</option>
                <option value="medenine">Médenine</option>
                <option value="tataouine">Tataouine</option>
                <option value="gafsa">Gafsa</option>
                <option value="tozeur">Tozeur</option>
                <option value="kebili">Kébili</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Type de transaction</label>
              <select name="type_transaction" value={filters.type_transaction} onChange={handleFilterChange}>
                <option value="">Tous les types</option>
                <option value="vente_totale">Vente totale</option>
                <option value="vente_partielle">Vente partielle</option>
                <option value="recherche_associe">Recherche d'associé</option>
                <option value="levee_fonds">Levée de fonds</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Prix minimum (TND)</label>
              <input
                type="number"
                name="prix_min"
                placeholder="Ex: 50000"
                value={filters.prix_min}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Prix maximum (TND)</label>
              <input
                type="number"
                name="prix_max"
                placeholder="Ex: 500000"
                value={filters.prix_max}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>CA minimum (TND)</label>
              <input
                type="number"
                name="ca_min"
                placeholder="Chiffre d'affaires min"
                value={filters.ca_min}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>CA maximum (TND)</label>
              <input
                type="number"
                name="ca_max"
                placeholder="Chiffre d'affaires max"
                value={filters.ca_max}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Rentabilité min (TND)</label>
              <input
                type="number"
                name="resultat_min"
                placeholder="Résultat net minimum"
                value={filters.resultat_min}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Rentabilité max (TND)</label>
              <input
                type="number"
                name="resultat_max"
                placeholder="Résultat net maximum"
                value={filters.resultat_max}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Employés (min)</label>
              <input
                type="number"
                name="employes_min"
                placeholder="Ex: 5"
                value={filters.employes_min}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Employés (max)</label>
              <input
                type="number"
                name="employes_max"
                placeholder="Ex: 50"
                value={filters.employes_max}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Année de création (après)</label>
              <input
                type="number"
                name="annee_min"
                placeholder="Ex: 2010"
                value={filters.annee_min}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={fetchEntreprises}>
            Appliquer les filtres
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <p className="loading">Chargement des entreprises...</p>
        ) : entreprises.length === 0 ? (
          <p className="no-results">Aucune entreprise trouvée.</p>
        ) : (
          <div className="entreprise-grid">
            {entreprises.map((entreprise) => (
              <div key={entreprise.id} className="entreprise-card">
                <button 
                  className={`favorite-btn ${isFavorite(entreprise.id) ? 'active' : ''}`}
                  onClick={() => handleToggleFavorite(entreprise.id)}
                  title={isFavorite(entreprise.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isFavorite(entreprise.id) ? '★' : '☆'}
                </button>
                <div className="comparison-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedForComparison.includes(entreprise.id)}
                    onChange={() => handleToggleComparison(entreprise.id)}
                    id={`compare-${entreprise.id}`}
                  />
                  <label htmlFor={`compare-${entreprise.id}`}>Comparer</label>
                </div>
                {entreprise.logo && (
                  <img src={entreprise.logo} alt={entreprise.nom} />
                )}
                <h3>{entreprise.nom}</h3>
                <p className="location">
                  {entreprise.region} - {entreprise.ville}
                </p>
                <p className="description">
                  {entreprise.description?.substring(0, 100)}...
                </p>
                <div className="card-footer">
                  <span className="price">{entreprise.prix_demande} TND</span>
                  <Link
                    to={`/entreprises/${entreprise.slug}`}
                    className="btn btn-primary"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepriseList;
