import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';
import './PublierEntreprise.css';

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
      <div className="publier-page">
        <div className="container">
          <div className="loading">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="publier-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Retour au dashboard
        </button>
        
        <h1>✏️ Modifier l'entreprise</h1>
        <p className="page-subtitle">
          Modifiez les informations de votre entreprise
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="publier-form">
          {/* Informations générales */}
          <div className="form-section">
            <h2>Informations générales</h2>
            
            <div className="form-group">
              <label>Nom de l'entreprise *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Secteur d'activité *</label>
                <select
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  {secteurs.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Région *</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  {regions.map(r => (
                    <option key={r.toLowerCase()} value={r.toLowerCase()}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Ville *</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Informations financières */}
          <div className="form-section">
            <h2>Informations financières</h2>

            <div className="form-group">
              <label>Prix demandé (TND) *</label>
              <input
                type="number"
                name="prix_demande"
                value={formData.prix_demande}
                onChange={handleChange}
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Chiffre d'affaires (TND)</label>
                <input
                  type="number"
                  name="chiffre_affaires"
                  value={formData.chiffre_affaires}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Résultat net (TND)</label>
                <input
                  type="number"
                  name="resultat_net"
                  value={formData.resultat_net}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Informations opérationnelles */}
          <div className="form-section">
            <h2>Informations opérationnelles</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre d'employés</label>
                <input
                  type="number"
                  name="nombre_employes"
                  value={formData.nombre_employes}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Année de création</label>
                <input
                  type="number"
                  name="annee_creation"
                  value={formData.annee_creation}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          {/* Type de transaction */}
          <div className="form-section">
            <h2>Type de transaction</h2>

            <div className="form-group">
              <label>Type *</label>
              <select
                name="type_transaction"
                value={formData.type_transaction}
                onChange={handleChange}
                required
              >
                <option value="vente_totale">Vente totale</option>
                <option value="vente_partielle">Vente partielle</option>
                <option value="recherche_associe">Recherche d'associé</option>
                <option value="levee_fonds">Levée de fonds</option>
              </select>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="form-section">
            <h2>Confidentialité</h2>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="nom_masque"
                  checked={formData.nom_masque}
                  onChange={handleChange}
                />
                <span>Masquer le nom de l'entreprise</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="adresse_masquee"
                  checked={formData.adresse_masquee}
                  onChange={handleChange}
                />
                <span>Masquer l'adresse exacte</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-large"
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModifierEntreprise;
