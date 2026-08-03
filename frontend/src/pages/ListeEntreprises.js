import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { favorisService } from '../services/favorisService';
import { authService } from '../services/authService';

function ListeEntreprises() {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorisStatus, setFavorisStatus] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    secteur: '', region: '', prix_min: '', prix_max: '', search: '',
  });

  const isAuthenticated = authService.isAuthenticated();
  const userType = authService.getUserType();

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await entrepriseService.getAll();
      setEntreprises(Array.isArray(data) ? data : []);
      if (isAuthenticated && userType === 'acheteur') {
        loadFavorisStatus(data);
      }
    } catch (err) {
      console.error('Error fetching entreprises:', err);
      setError('Erreur lors du chargement des entreprises');
      setEntreprises([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorisStatus = async (entreprisesList) => {
    try {
      const favoris = await favorisService.getFavoris();
      const status = {};
      const favorisSlugs = favoris.map(f => f.entreprise?.slug).filter(Boolean);
      entreprisesList.forEach(ent => {
        status[ent.slug] = favorisSlugs.includes(ent.slug);
      });
      setFavorisStatus(status);
    } catch (err) {
      console.error('Error loading favoris status:', err);
    }
  };

  const handleToggleFavori = async (slug, e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (userType !== 'acheteur') return;
    try {
      if (favorisStatus[slug]) {
        await favorisService.removeFavori(slug);
        setFavorisStatus({ ...favorisStatus, [slug]: false });
      } else {
        await favorisService.addFavori(slug);
        setFavorisStatus({ ...favorisStatus, [slug]: true });
      }
    } catch (err) {
      console.error('Error toggling favori:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ secteur: '', region: '', prix_min: '', prix_max: '', search: '' });
  };

  const filteredEntreprises = entreprises.filter((ent) => {
    if (filters.search && !ent.nom?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !ent.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.secteur && ent.secteur !== filters.secteur) return false;
    if (filters.region && ent.region !== filters.region) return false;
    if (filters.prix_min && parseFloat(ent.prix_demande) < parseFloat(filters.prix_min)) return false;
    if (filters.prix_max && parseFloat(ent.prix_demande) > parseFloat(filters.prix_max)) return false;
    return true;
  });

  const secteurs = [
    { value: 'industrie', label: 'Industrie' }, { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' }, { value: 'commerce', label: 'Commerce' },
    { value: 'tourisme', label: 'Tourisme' }, { value: 'transport', label: 'Transport' },
    { value: 'sante', label: 'Santé' }, { value: 'informatique', label: 'Informatique' },
    { value: 'education', label: 'Éducation' }, { value: 'btp', label: 'BTP' },
    { value: 'franchise', label: 'Franchise' }, { value: 'startup', label: 'Startups' },
    { value: 'autre', label: 'Autres' },
  ];

  const regions = [
    'tunis', 'ariana', 'ben_arous', 'manouba', 'nabeul', 'zaghouan',
    'bizerte', 'beja', 'jendouba', 'le_kef', 'siliana', 'sousse',
    'monastir', 'mahdia', 'sfax', 'kairouan', 'kasserine', 'sidi_bouzid',
    'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili',
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(price);
  };

  const getSecteurLabel = (value) => {
    const s = secteurs.find(s => s.value === value);
    return s ? s.label : value;
  };

  const getRegionLabel = (value) => {
    return value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-primary-500 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <h1>Entreprises à vendre</h1>
          <p>{filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''} disponible{filteredEntreprises.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Quick search + filter toggle */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Rechercher..."
            className="input flex-1"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center px-4 rounded-xl border-2 border-primary-500 text-primary-600 font-semibold hover:bg-primary-50 active:scale-95 transition-all md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className={`bg-white rounded-2xl shadow-card border border-gray-100 p-4 md:p-6 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">Secteur</label>
              <select name="secteur" value={filters.secteur} onChange={handleFilterChange} className="input">
                <option value="">Tous</option>
                {secteurs.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Région</label>
              <select name="region" value={filters.region} onChange={handleFilterChange} className="input">
                <option value="">Toutes</option>
                {regions.map(r => <option key={r} value={r}>{getRegionLabel(r)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Prix min (TND)</label>
              <input type="number" name="prix_min" value={filters.prix_min} onChange={handleFilterChange} placeholder="100000" min="0" className="input" />
            </div>
            <div>
              <label className="label">Prix max (TND)</label>
              <input type="number" name="prix_max" value={filters.prix_max} onChange={handleFilterChange} placeholder="500000" min="0" className="input" />
            </div>
          </div>
          <button onClick={resetFilters} className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
            Réinitialiser les filtres
          </button>
        </div>

        {/* Grid */}
        {filteredEntreprises.length === 0 ? (
          <div className="empty-state">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 mb-4">Aucune entreprise ne correspond à vos critères</p>
            <button onClick={resetFilters} className="btn-primary">Voir toutes les entreprises</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEntreprises.map((ent) => (
              <div
                key={ent.id}
                onClick={() => navigate(`/entreprises/${ent.slug}`)}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-floating hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Card header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      {ent.est_mise_en_avant && (
                        <svg className="w-5 h-5 text-warning-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                      {ent.nom_masque ? 'Confidentiel' : ent.nom}
                    </h3>
                    <span className="badge-primary shrink-0">{getSecteurLabel(ent.secteur)}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {ent.description?.length > 120 ? ent.description.substring(0, 120) + '...' : ent.description}
                  </p>
                </div>

                {/* Card info */}
                <div className="px-5 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-xs">{ent.adresse_masquee ? getRegionLabel(ent.region) : `${ent.ville || ''}, ${getRegionLabel(ent.region)}`}</span>
                    </div>
                    {ent.nombre_employes !== null && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">{ent.nombre_employes} emp.</span>
                      </div>
                    )}
                    {ent.annee_creation && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{ent.annee_creation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs">{ent.nombre_vues} vues</span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between p-5 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">Prix</span>
                    <div className="text-lg font-bold text-primary-600">{formatPrice(ent.prix_demande)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && userType === 'acheteur' && (
                      <button
                        onClick={(e) => handleToggleFavori(ent.slug, e)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all active:scale-90 ${
                          favorisStatus[ent.slug] ? 'border-danger-500 text-danger-500 bg-danger-50' : 'border-gray-200 text-gray-400 hover:border-danger-300'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={favorisStatus[ent.slug] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/entreprises/${ent.slug}`)}
                      className="inline-flex items-center gap-1 px-4 h-10 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 active:scale-95 transition-all"
                    >
                      Détails
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

export default ListeEntreprises;
