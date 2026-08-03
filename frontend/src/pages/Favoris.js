import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favorisService } from '../services/favorisService';
import { authService } from '../services/authService';

function Favoris() {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    if (authService.getUserType() !== 'acheteur') { navigate('/dashboard'); return; }
    loadFavoris();
  }, [navigate]);

  const loadFavoris = async () => {
    try {
      setLoading(true);
      const data = await favorisService.getFavoris();
      setFavoris(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavori = async (slug) => {
    if (!window.confirm('Retirer cette entreprise de vos favoris ?')) return;
    try {
      setRemoving(slug);
      await favorisService.removeFavori(slug);
      setFavoris(favoris.filter(f => f.entreprise.slug !== slug));
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setRemoving(null);
    }
  };

  const toggleCompareSelection = (slug) => {
    if (selectedForComparison.includes(slug)) {
      setSelectedForComparison(selectedForComparison.filter(s => s !== slug));
    } else {
      if (selectedForComparison.length >= 4) return;
      setSelectedForComparison([...selectedForComparison, slug]);
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) return;
    navigate(`/comparateur?slugs=${selectedForComparison.join(',')}`);
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(price);
  const getSecteurLabel = (v) => ({
    'industrie': 'Industrie', 'agriculture': 'Agriculture', 'services': 'Services', 'commerce': 'Commerce',
    'tourisme': 'Tourisme', 'transport': 'Transport', 'sante': 'Santé', 'informatique': 'Informatique',
    'education': 'Éducation', 'btp': 'BTP', 'franchise': 'Franchise', 'startup': 'Startups', 'autre': 'Autres',
  })[v] || v;
  const getRegionLabel = (v) => v?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <h1>Mes Favoris</h1>
          <p>{favoris.length} entreprise{favoris.length > 1 ? 's' : ''} sauvegardée{favoris.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Comparison bar */}
        {favoris.length > 1 && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-2xl bg-white border border-gray-100 shadow-soft">
            <span className="text-sm text-gray-600">
              {selectedForComparison.length} sélectionnée{selectedForComparison.length > 1 ? 's' : ''} pour comparaison
            </span>
            <div className="flex items-center gap-2">
              {selectedForComparison.length > 0 && (
                <button onClick={() => setSelectedForComparison([])} className="text-sm text-gray-500 hover:text-gray-700">Effacer</button>
              )}
              <button onClick={handleCompare} disabled={selectedForComparison.length < 2}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 bg-primary-500 text-white hover:bg-primary-600 active:scale-95">
                Comparer ({selectedForComparison.length}/4)
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
        )}

        {favoris.length === 0 ? (
          <div className="empty-state min-h-[40vh]">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun favori</h3>
            <p className="text-gray-500 text-sm mb-4 text-center max-w-md">
              Parcourez les annonces et cliquez sur le cœur pour sauvegarder vos entreprises préférées.
            </p>
            <button onClick={() => navigate('/entreprises')} className="btn-primary">Voir les entreprises</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoris.map((favori) => {
              const ent = favori.entreprise;
              const isSelected = selectedForComparison.includes(ent.slug);
              return (
                <div key={favori.id}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    isSelected ? 'border-primary-500 shadow-card ring-2 ring-primary-100' : 'border-gray-100 shadow-card'
                  }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleCompareSelection(ent.slug)}
                        className="w-5 h-5 rounded accent-primary-500" title="Sélectionner pour comparer" />
                      <h3 className="text-lg font-bold text-gray-900">{ent.nom_masque ? 'Confidentielle' : ent.nom}</h3>
                    </div>
                    <button onClick={() => handleRemoveFavori(ent.slug)} disabled={removing === ent.slug}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-danger-500 hover:bg-danger-50 transition-colors disabled:opacity-50">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge-primary">{getSecteurLabel(ent.secteur)}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{getRegionLabel(ent.region)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ent.description?.substring(0, 150)}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Prix</p>
                      <p className="text-lg font-bold text-primary-600">{formatPrice(ent.prix_demande)}</p>
                    </div>
                    {ent.chiffre_affaires && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">CA</p>
                        <p className="text-sm font-semibold text-gray-700">{formatPrice(ent.chiffre_affaires)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>Ajouté le {formatDate(favori.created_at)}</span>
                    <span>{ent.nombre_vues} vues</span>
                  </div>
                  <button onClick={() => navigate(`/entreprises/${ent.slug}`)} className="btn-primary w-full">Voir les détails</button>
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
