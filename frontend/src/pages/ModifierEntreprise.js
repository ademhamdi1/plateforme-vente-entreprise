import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';

function ModifierEntreprise() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    secteur: '',
    region: '',
    ville: '',
    historique: '',
    prix_demande: '',
    chiffre_affaires: '',
    resultat_net: '',
    valeur_actifs: '',
    endettement: '',
    nombre_employes: '',
    annee_creation: '',
    surface_local: '',
    equipements_inclus: '',
    video_url: '',
    type_transaction: 'vente_totale',
    points_forts: '',
    opportunites_developpement: '',
    nom_masque: false,
    adresse_masquee: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadEntreprise = useCallback(async () => {
    try {
      setLoading(true);
      // Load from PostgreSQL
      const data = await entrepriseService.getBySlug(slug);

      // Fill form with data from PostgreSQL
      setFormData({
        nom: data.nom || '',
        description: data.description || '',
        secteur: data.secteur || '',
        region: data.region || '',
        ville: data.ville || '',
        historique: data.historique || '',
        prix_demande: data.prix_demande || '',
        chiffre_affaires: data.chiffre_affaires || '',
        resultat_net: data.resultat_net || '',
        valeur_actifs: data.valeur_actifs || '',
        endettement: data.endettement || '',
        nombre_employes: data.nombre_employes || '',
        annee_creation: data.annee_creation || '',
        surface_local: data.surface_local || '',
        equipements_inclus: data.equipements_inclus || '',
        video_url: data.video_url || '',
        type_transaction: data.type_transaction || 'vente_totale',
        points_forts: data.points_forts || '',
        opportunites_developpement: data.opportunites_developpement || '',
        nom_masque: data.nom_masque || false,
        adresse_masquee: data.adresse_masquee || false,
      });
    } catch (err) {
      console.error('Error loading entreprise:', err);
      setError('Entreprise non trouvée ou vous n\'avez pas les droits');
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    // Check if user is vendeur
    const userType = authService.getUserType();
    if (userType !== 'vendeur') {
      navigate('/dashboard');
      return;
    }
    loadEntreprise();
  }, [navigate, loadEntreprise]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Update in PostgreSQL
      await entrepriseService.update(slug, formData);

      alert('✅ Entreprise modifiée avec succès !');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating entreprise:', err);
      setError(
        err.response?.data?.nom?.[0] ||
        err.response?.data?.prix_demande?.[0] ||
        'Erreur lors de la modification. Vérifiez vos informations.'
      );
    } finally {
      setSaving(false);
    }
  };

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
    { value: 'autre', label: 'Autres activités économiques' },
  ];

  const regions = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" />
            </svg>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          className="btn-secondary inline-flex items-center gap-2 mb-4"
          onClick={() => navigate('/dashboard')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour au dashboard
        </button>

        <div className="page-header">
          <h1 className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier l'entreprise
          </h1>
          <p>Modifiez les informations de votre entreprise</p>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-danger-50 border border-danger-200 p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Informations générales */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Informations générales
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">Nom de l'entreprise *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Secteur d'activité *</label>
                  <select
                    name="secteur"
                    value={formData.secteur}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Sélectionnez...</option>
                    {secteurs.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Région *</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Sélectionnez...</option>
                    {regions.map(r => (
                      <option key={r.toLowerCase()} value={r.toLowerCase()}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Informations financières */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.604-.267-.75-.389-.372-.297-.94-.297-1.312 0a.75.75 0 01-.937-1.171c.45-.358.96-.638 1.5-.838V6a1 1 0 112 0v.092a4.535 4.535 0 011.676.662C13.398 7.234 14 8.009 14 9c0 .99-.602 1.765-1.324 2.246-.48.32-1.054.545-1.676.662v1.941c.391-.127.604-.267.75-.389.372-.297.94-.297 1.312 0a.75.75 0 01.937-1.171c-.45.358-.96.638-1.5.838V6z" clipRule="evenodd" />
              </svg>
              Informations financières
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">Prix demandé (TND) *</label>
                <input
                  type="number"
                  name="prix_demande"
                  value={formData.prix_demande}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Chiffre d'affaires (TND)</label>
                  <input
                    type="number"
                    name="chiffre_affaires"
                    value={formData.chiffre_affaires}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Résultat net (TND)</label>
                  <input
                    type="number"
                    name="resultat_net"
                    value={formData.resultat_net}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations opérationnelles */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Informations opérationnelles
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nombre d'employés</label>
                  <input
                    type="number"
                    name="nombre_employes"
                    value={formData.nombre_employes}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Année de création</label>
                  <input
                    type="number"
                    name="annee_creation"
                    value={formData.annee_creation}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Type de transaction */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Type de transaction
            </h2>

            <div>
              <label className="label">Type *</label>
              <select
                name="type_transaction"
                value={formData.type_transaction}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="vente_totale">Vente totale</option>
                <option value="vente_partielle">Vente partielle</option>
                <option value="recherche_associe">Recherche d'associé</option>
                <option value="levee_fonds">Levée de fonds</option>
              </select>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Confidentialité
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="nom_masque"
                  checked={formData.nom_masque}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Masquer le nom de l'entreprise</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="adresse_masquee"
                  checked={formData.adresse_masquee}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Masquer l'adresse exacte</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary inline-flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" />
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586l-2.293-2.293z" />
                  </svg>
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierEntreprise;
