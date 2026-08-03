import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { temoignageService } from '../services/temoignageService';
import { toast } from 'react-toastify';

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
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((note) => (
          <button
            key={note}
            type="button"
            className={`text-3xl transition-transform hover:scale-110 ${note <= currentNote ? 'text-amber-400' : 'text-gray-300'}`}
            onClick={() => handleStarClick(note)}
            aria-label={`${note} étoile${note > 1 ? 's' : ''}`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const getNoteLabel = (note) => {
    const labels = {
      5: 'Excellent',
      4: 'Très bien',
      3: 'Bien',
      2: 'Moyen',
      1: 'Décevant',
    };
    return labels[note] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h1>Laissez votre avis</h1>
          </div>
          <p>Partagez votre expérience avec la plateforme</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Note */}
            <div>
              <label className="label">Votre note *</label>
              <div className="mt-2 flex items-center gap-4 flex-wrap">
                {renderStars(formData.note)}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium border border-amber-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {getNoteLabel(formData.note)}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div>
              <label className="label" htmlFor="contenu">Votre témoignage * (20-500 caractères)</label>
              <textarea
                id="contenu"
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                placeholder="Partagez votre expérience avec la plateforme..."
                rows="6"
                required
                maxLength="500"
                className="input resize-none"
              />
              <div className="mt-1.5 text-sm text-gray-500 text-right">
                {formData.contenu.length} / 500 caractères
              </div>
            </div>

            {/* Entreprise concernée */}
            <div>
              <label className="label" htmlFor="entreprise_concernee">
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
                className="input"
              />
              <small className="block mt-1.5 text-sm text-gray-500">
                Si votre avis concerne une transaction spécifique
              </small>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || formData.contenu.length < 20}
            >
              {loading ? (
                'Envoi en cours...'
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Soumettre mon avis
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              * Votre témoignage sera vérifié par notre équipe avant publication
            </p>
          </form>
        </div>

        {/* Mes témoignages */}
        {mesTemoignages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Mes témoignages
            </h2>
            <div className="space-y-4">
              {mesTemoignages.map((temoignage) => (
                <div key={temoignage.id} className="card">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="text-amber-400 text-lg">
                      {temoignage.etoiles}
                    </div>
                    <span className={temoignage.est_publie ? 'badge-success' : 'badge-warning'}>
                      {temoignage.est_publie ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          Publié
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          En attente
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{temoignage.contenu}</p>
                  {temoignage.entreprise_concernee && (
                    <p className="text-sm text-gray-500 inline-flex items-center gap-1 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {temoignage.entreprise_concernee}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
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
