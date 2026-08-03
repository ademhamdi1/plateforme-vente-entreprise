import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import actualiteService from '../services/actualiteService';

function ActualiteDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadActualite();
  }, [slug]);

  const loadActualite = async () => {
    try {
      setLoading(true);
      const data = await actualiteService.getActualite(slug);
      setActualite(data);
    } catch (err) {
      setError('Actualité non trouvée');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <button onClick={() => navigate('/actualites')} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux actualités
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/actualites')}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux actualités
        </button>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          {/* Header */}
          <header className="p-6 md:p-8 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{actualite.titre}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Par {actualite.auteur_nom}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(actualite.date_publication)}
              </span>
            </div>
          </header>

          {/* Image */}
          {actualite.image_url && (
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
              <img
                src={actualite.image_url}
                alt={actualite.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              {actualite.contenu.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/actualites')}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux actualités
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActualiteDetail;
