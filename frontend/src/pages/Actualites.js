import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import actualiteService from '../services/actualiteService';

function Actualites() {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadActualites();
  }, []);

  const loadActualites = async () => {
    try {
      setLoading(true);
      const data = await actualiteService.getActualites();
      // Assurer que data est un tableau
      setActualites(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des actualités');
      console.error(err);
      setActualites([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <h1>Actualités</h1>
          <p>Restez informé des dernières nouvelles de BusinessBuy</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {actualites.length === 0 ? (
          <div className="empty-state">
            <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Aucune actualité disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actualites.map((actualite) => (
              <div
                key={actualite.id}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-floating hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/actualites/${actualite.slug}`)}
              >
                {actualite.image_url && (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={actualite.image_url}
                      alt={actualite.titre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{actualite.titre}</h2>
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Par {actualite.auteur_nom}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(actualite.date_publication)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {truncateText(actualite.contenu, 150)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Lire la suite
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Actualites;
