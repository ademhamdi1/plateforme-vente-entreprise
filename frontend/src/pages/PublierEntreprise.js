import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';
import { mediaService } from '../services/mediaService';
import './PublierEntreprise.css';

function PublierEntreprise() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations générales
    nom: '',
    description: '',
    secteur: '',
    region: '',
    ville: '',
    historique: '',
    
    // Informations financières
    prix_demande: '',
    chiffre_affaires: '',
    resultat_net: '',
    valeur_actifs: '',
    endettement: '',
    
    // Informations opérationnelles
    nombre_employes: '',
    annee_creation: '',
    surface_local: '',
    equipements_inclus: '',
    video_url: '',
    
    // Transaction
    type_transaction: 'vente_totale',
    points_forts: '',
    opportunites_developpement: '',
    
    // Confidentialité
    nom_masque: false,
    adresse_masquee: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // États pour les médias
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    // Check if user is vendeur
    const userType = authService.getUserType();
    if (userType !== 'vendeur') {
      navigate('/dashboard');
    }
  }, [navigate]);

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
    setLoading(true);
    setError('');

    try {
      // Create entreprise - Save to PostgreSQL
      const result = await entrepriseService.create(formData);
      
      // Si un logo est sélectionné, l'uploader en premier avec is_logo=true
      if (selectedLogo) {
        await mediaService.uploadImage(result.slug, selectedLogo, '', 0, true);
      }
      
      // Si des images sont sélectionnées, les uploader
      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          await mediaService.uploadImage(result.slug, selectedImages[i], '', i, false);
        }
      }
      
      const logoMsg = selectedLogo ? ' avec logo' : '';
      const imagesMsg = selectedImages.length > 0 ? ` et ${selectedImages.length} photo(s)` : '';
      alert(`✅ Entreprise publiée${logoMsg}${imagesMsg} !`);
      
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Error creating entreprise:', err);
      setError(
        err.response?.data?.nom?.[0] ||
        err.response?.data?.prix_demande?.[0] ||
        'Erreur lors de la publication. Vérifiez vos informations.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection des images
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Filtrer uniquement les images valides
    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`❌ ${file.name} n'est pas une image valide`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`❌ ${file.name} dépasse 5 MB`);
        return false;
      }
      return true;
    });

    // Limiter à 10 images max
    const totalImages = selectedImages.length + validImages.length;
    if (totalImages > 10) {
      alert('❌ Maximum 10 images autorisées');
      return;
    }

    // Ajouter les nouvelles images
    setSelectedImages([...selectedImages, ...validImages]);

    // Créer les aperçus
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Supprimer une image de la sélection
  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Gérer la sélection du logo
  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Valider le fichier
    if (!file.type.startsWith('image/')) {
      alert('❌ Veuillez sélectionner une image valide');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Le logo ne doit pas dépasser 5 MB');
      return;
    }

    setSelectedLogo(file);

    // Créer l'aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Supprimer le logo
  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
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

  return (
    <div className="publier-page">
      <div className="container">
        <h1>read all my code de mon projet et tell me combier sur 100 dapres cahier de charge

 Publier une entreprise</h1>
        <p className="page-subtitle">
          
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
                placeholder="Ex: Restaurant Le Gourmet"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre entreprise..."
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
                placeholder="Ex: Tunis"
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
                placeholder="Ex: 500000"
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
                  placeholder="Ex: 200000"
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
                  placeholder="Ex: 50000"
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
                  placeholder="Ex: 10"
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
                  placeholder="Ex: 2015"
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

          {/* SECTION MÉDIAS */}
          <div className="form-section">
            <h2>🏢 Logo de l'entreprise (optionnel)</h2>
            <p className="form-section-desc">Ajoutez le logo principal de votre entreprise</p>

            <div className="logo-upload-zone">
              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleLogoSelect}
                style={{ display: 'none' }}
              />
              
              {!logoPreview ? (
                <label 
                  htmlFor="logoInput" 
                  className="logo-upload-placeholder"
                >
                  <div className="placeholder-content">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Cliquez pour ajouter un logo</span>
                    <span className="upload-hint">PNG, JPG (max 5 MB)</span>
                  </div>
                </label>
              ) : (
                <div className="logo-preview-container">
                  <img src={logoPreview} alt="Logo" className="logo-preview" />
                  <button
                    type="button"
                    className="btn-remove-logo"
                    onClick={handleRemoveLogo}
                  >
                    ✕ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>📸 Photos de l'entreprise (optionnel)</h2>
            <p className="form-section-desc">Ajoutez jusqu'à 10 photos supplémentaires</p>

            <div className="upload-zone">
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              <label 
                htmlFor="imageInput" 
                className="btn btn-secondary btn-block"
              >
                📁 Choisir des images (max 10)
              </label>

              {/* Aperçus des images sélectionnées */}
              {imagePreviews.length > 0 && (
                <div className="images-preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-card">
                      <img src={preview} alt={`Aperçu ${index + 1}`} />
                      <button
                        type="button"
                        className="btn-remove-preview"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="info-text">
                {selectedImages.length}/10 images sélectionnées
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-large"
            disabled={loading}
          >
            {loading ? 'Publication en cours...' : '🚀 Publier l\'entreprise'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublierEntreprise;
