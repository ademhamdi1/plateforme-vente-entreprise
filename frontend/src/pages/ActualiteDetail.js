import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import actualiteService from '../services/actualiteService';
import './ActualiteDetail.css';

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
      <div className="actualite-detail-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="actualite-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/actualites')} className="back-btn">
          ← Retour aux actualités
        </button>
      </div>
    );
  }

  return (
    <div className="actualite-detail-container">
      <button onClick={() => navigate('/actualites')} className="back-btn">
        ← Retour aux actualités
      </button>

      <article className="actualite-detail">
        <header className="actualite-detail-header">
          <h1>{actualite.titre}</h1>
          <div className="actualite-detail-meta">
            <span className="author">Par {actualite.auteur_nom}</span>
            <span className="date">{formatDate(actualite.date_publication)}</span>
          </div>
        </header>

        {actualite.image_url && (
          <div className="actualite-detail-image">
            <img src={actualite.image_url} alt={actualite.titre} />
          </div>
        )}

        <div className="actualite-detail-content">
          {actualite.contenu.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="actualite-footer">
        <button onClick={() => navigate('/actualites')} className="back-btn-bottom">
          ← Retour aux actualités
        </button>
      </div>
    </div>
  );
}

export default ActualiteDetail;
