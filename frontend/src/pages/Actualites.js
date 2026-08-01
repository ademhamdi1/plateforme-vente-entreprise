import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import actualiteService from '../services/actualiteService';
import './Actualites.css';

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
      <div className="actualites-container">
        <div className="loading">Chargement des actualités...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="actualites-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="actualites-container">
      <div className="actualites-header">
        <h1>Actualités</h1>
        <p>Restez informé des dernières nouvelles de BusinessBuy</p>
      </div>

      {actualites.length === 0 ? (
        <div className="no-actualites">
          <p>Aucune actualité disponible pour le moment.</p>
        </div>
      ) : (
        <div className="actualites-grid">
          {actualites.map((actualite) => (
            <div
              key={actualite.id}
              className="actualite-card"
              onClick={() => navigate(`/actualites/${actualite.slug}`)}
            >
              {actualite.image_url && (
                <div className="actualite-image">
                  <img src={actualite.image_url} alt={actualite.titre} />
                </div>
              )}
              <div className="actualite-content">
                <h2 className="actualite-titre">{actualite.titre}</h2>
                <div className="actualite-meta">
                  <span className="actualite-auteur">
                    Par {actualite.auteur_nom}
                  </span>
                  <span className="actualite-date">
                    {formatDate(actualite.date_publication)}
                  </span>
                </div>
                <p className="actualite-extrait">
                  {truncateText(actualite.contenu, 150)}
                </p>
                <button className="lire-plus-btn">
                  Lire la suite →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Actualites;
