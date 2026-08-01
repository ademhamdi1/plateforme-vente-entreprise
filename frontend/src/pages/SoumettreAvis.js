import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { temoignageService } from '../services/temoignageService';
import { toast } from 'react-toastify';
import './SoumettreAvis.css';

function SoumettreAvis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mesTemoignages, setMesTemoignages] = useState([]);
  const [formData, setFormData] = useState({
    contenu: '',
    note: 5,
    entreprise_concernee: '',
  });

  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour laisser un avis');
      navigate('/login');
      return;
    }
    loadMesTemoignages();
  }, [isAuthenticated, navigate]);

  const loadMesTemoignages = async () => {
    try {
      const data = await temoignageService.getMesTemoignages();
      setMesTemoignages(data);
    } catch (err) {
      console.error('Erreur chargement témoignages:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (note) => {
    setFormData({
      ...formData,
      note: note,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.contenu.length < 20) {
      toast.error('Le témoignage doit contenir au moins 20 caractères');
      return;
    }

    if (formData.contenu.length > 500) {
      toast.error('Le témoignage ne doit pas dépasser 500 caractères');
      return;
    }

    try {
      setLoading(true);
      await temoignageService.creerTemoignage(formData);
      toast.success('Votre témoignage a été soumis et sera publié après validation par notre équipe');
      
      // Reset form
      setFormData({
        contenu: '',
        note: 5,
        entreprise_concernee: '',
      });

      // Reload mes temoignages
      loadMesTemoignages();
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erreur lors de la soumission du témoignage');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentNote) => {
    return (
      <div className="stars-selector">
        {[1, 2, 3, 4, 5].map((note) => (
          <button
            key={note}
            type="button"
            className={`star-btn ${note <= currentNote ? 'active' : ''}`}
            onClick={() => handleStarClick(note)}
          >
            {note <= currentNote ? '★' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="soumettre-avis-page">
      <div className="soumettre-container">
        <div className="soumettre-header">
          <h1>💬 Laissez votre avis</h1>
          <p>Partagez votre expérience avec la plateforme</p>
        </div>

        {/* Formulaire de soumission */}
        <div className="avis-form-card">
          <form onSubmit={handleSubmit}>
            {/* Note */}
            <div className="form-group">
              <label>Votre note *</label>
              {renderStars(formData.note)}
              <span className="note-label">
                {formData.note === 5 && '⭐ Excellent'}
                {formData.note === 4 && '👍 Très bien'}
                {formData.note === 3 && '😊 Bien'}
                {formData.note === 2 && '😐 Moyen'}
                {formData.note === 1 && '😞 Décevant'}
              </span>
            </div>

            {/* Contenu */}
            <div className="form-group">
              <label htmlFor="contenu">Votre témoignage * (20-500 caractères)</label>
              <textarea
                id="contenu"
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                placeholder="Partagez votre expérience avec la plateforme..."
                rows="6"
                required
                maxLength="500"
              />
              <div className="char-count">
                {formData.contenu.length} / 500 caractères
              </div>
            </div>

            {/* Entreprise concernée (optionnel) */}
            <div className="form-group">
              <label htmlFor="entreprise_concernee">
                Entreprise concernée (optionnel)
              </label>
              <input
                type="text"
                id="entreprise_concernee"
                name="entreprise_concernee"
                value={formData.entreprise_concernee}
                onChange={handleChange}
                placeholder="Ex: Restaurant Le Gourmet"
                maxLength="200"
              />
              <small className="form-hint">
                Si votre avis concerne une transaction spécifique
              </small>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || formData.contenu.length < 20}
            >
              {loading ? 'Envoi en cours...' : '✉️ Soumettre mon avis'}
            </button>

            <p className="form-note">
              * Votre témoignage sera vérifié par notre équipe avant publication
            </p>
          </form>
        </div>

        {/* Mes témoignages */}
        {mesTemoignages.length > 0 && (
          <div className="mes-temoignages-section">
            <h2>📝 Mes témoignages</h2>
            <div className="temoignages-list">
              {mesTemoignages.map((temoignage) => (
                <div key={temoignage.id} className="temoignage-card">
                  <div className="temoignage-header">
                    <div className="temoignage-stars">
                      {temoignage.etoiles}
                    </div>
                    <span className={`status-badge ${temoignage.est_publie ? 'publie' : 'en-attente'}`}>
                      {temoignage.est_publie ? '✓ Publié' : '⏳ En attente'}
                    </span>
                  </div>
                  <p className="temoignage-contenu">{temoignage.contenu}</p>
                  {temoignage.entreprise_concernee && (
                    <p className="temoignage-entreprise">
                      📍 {temoignage.entreprise_concernee}
                    </p>
                  )}
                  <p className="temoignage-date">
                    {new Date(temoignage.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SoumettreAvis;
