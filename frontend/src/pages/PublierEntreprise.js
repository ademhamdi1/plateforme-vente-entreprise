import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import entrepriseService from '../services/entrepriseService';
import { mediaService } from '../services/mediaService';

function PublierEntreprise() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations générales
    nom: '',
    description: '',
    secteur: '',
    region: '',
    ville: '',
    adresse: '',
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
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
    // Clear errors when user starts typing
    setError('');
    setErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});
    setSuccessMessage('');

    // Client-side validation
    const validationErrors = {};
    
    if (!formData.nom || formData.nom.trim() === '') {
      validationErrors.nom = 'Le nom de l\'entreprise est obligatoire';
    }
    if (!formData.description || formData.description.trim() === '') {
      validationErrors.description = 'La description est obligatoire';
    }
    if (!formData.secteur) {
      validationErrors.secteur = 'Le secteur d\'activité est obligatoire';
    }
    if (!formData.region) {
      validationErrors.region = 'La région est obligatoire';
    }
    if (!formData.ville || formData.ville.trim() === '') {
      validationErrors.ville = 'La ville est obligatoire';
    }
    if (!formData.prix_demande || formData.prix_demande <= 0) {
      validationErrors.prix_demande = 'Le prix demandé doit être supérieur à 0';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Create detailed error message
      const errorList = [];
      if (validationErrors.nom) errorList.push('• Nom de l\'entreprise');
      if (validationErrors.description) errorList.push('• Description');
      if (validationErrors.secteur) errorList.push('• Secteur d\'activité');
      if (validationErrors.region) errorList.push('• Région');
      if (validationErrors.ville) errorList.push('• Ville');
      if (validationErrors.prix_demande) errorList.push('• Prix demandé');
      
      console.log('🔴 ERREURS DE VALIDATION:', validationErrors);
      console.log('🔴 NOMBRE D\'ERREURS:', Object.keys(validationErrors).length);
      
      setError(`❌ ${Object.keys(validationErrors).length} champ(s) obligatoire(s) manquant(s):\n\n${errorList.join('\n')}`);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Create entreprise - Save to PostgreSQL
      const result = await entrepriseService.create(formData);
      
      setSuccessMessage('✅ Entreprise créée avec succès! Upload des médias en cours...');

      // Si un logo est sélectionné, l'uploader en premier avec is_logo=true
      if (selectedLogo) {
        try {
          await mediaService.uploadImage(result.slug, selectedLogo, '', 0, true);
          setSuccessMessage('✅ Entreprise créée avec logo! Upload des photos en cours...');
        } catch (logoErr) {
          console.error('Logo upload error:', logoErr);
          setError('⚠️ L\'entreprise a été créée mais le logo n\'a pas pu être uploadé.');
        }
      }

      // Si des images sont sélectionnées, les uploader
      if (selectedImages.length > 0) {
        let uploadedCount = 0;
        for (let i = 0; i < selectedImages.length; i++) {
          try {
            await mediaService.uploadImage(result.slug, selectedImages[i], '', i, false);
            uploadedCount++;
            setSuccessMessage(`✅ ${uploadedCount}/${selectedImages.length} photos uploadées...`);
          } catch (imgErr) {
            console.error(`Image ${i} upload error:`, imgErr);
          }
        }
      }

      const logoMsg = selectedLogo ? ' avec logo' : '';
      const imagesMsg = selectedImages.length > 0 ? ` et ${selectedImages.length} photo(s)` : '';
      
      setSuccessMessage(`🎉 Entreprise publiée avec succès${logoMsg}${imagesMsg}!`);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error creating entreprise:', err);
      
      // Parse backend errors
      if (err.response?.data) {
        const backendErrors = {};
        const errorData = err.response.data;
        
        // Map backend field errors
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            backendErrors[field] = errorData[field][0];
          } else if (typeof errorData[field] === 'string') {
            backendErrors[field] = errorData[field];
          }
        });
        
        setErrors(backendErrors);
        
        // Create a comprehensive error message
        const errorMessages = [];
        if (errorData.nom) errorMessages.push(`❌ Nom: ${backendErrors.nom}`);
        if (errorData.prix_demande) errorMessages.push(`❌ Prix: ${backendErrors.prix_demande}`);
        if (errorData.description) errorMessages.push(`❌ Description: ${backendErrors.description}`);
        if (errorData.secteur) errorMessages.push(`❌ Secteur: ${backendErrors.secteur}`);
        if (errorData.region) errorMessages.push(`❌ Région: ${backendErrors.region}`);
        if (errorData.ville) errorMessages.push(`❌ Ville: ${backendErrors.ville}`);
        if (errorData.detail) errorMessages.push(`❌ ${errorData.detail}`);
        if (errorData.error) errorMessages.push(`❌ ${errorData.error}`);
        
        if (errorMessages.length > 0) {
          setError(errorMessages.join('\n'));
        } else if (errorData.non_field_errors) {
          setError(`❌ ${errorData.non_field_errors[0]}`);
        } else {
          setError('❌ Erreur lors de la publication. Vérifiez vos informations.');
        }
      } else if (err.request) {
        setError('❌ Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      } else {
        setError(`❌ Erreur: ${err.message}`);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="page-header">
          <h1 className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5z" />
            </svg>
            Publier une entreprise
          </h1>
          <p>Remplissez les informations ci-dessous pour mettre votre entreprise en vente</p>
        </div>

        {successMessage && (
          <div className="mt-6 rounded-md bg-success-50 border border-success-200 p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-success-700 whitespace-pre-line">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-md bg-danger-50 border border-danger-200 p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-danger-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
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
                  placeholder="Ex: Restaurant Le Gourmet"
                  required
                  className={`input ${errors.nom ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                />
                {errors.nom && (
                  <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                    <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.nom}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre entreprise..."
                  rows="5"
                  required
                  className={`input ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                />
                {errors.description && (
                  <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                    <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Secteur d'activité *</label>
                  <select
                    name="secteur"
                    value={formData.secteur}
                    onChange={handleChange}
                    required
                    className={`input ${errors.secteur ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                  >
                    <option value="">Sélectionnez...</option>
                    {secteurs.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {errors.secteur && (
                    <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                      <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errors.secteur}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Région *</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className={`input ${errors.region ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                  >
                    <option value="">Sélectionnez...</option>
                    {regions.map(r => (
                      <option key={r.toLowerCase()} value={r.toLowerCase()}>{r}</option>
                    ))}
                  </select>
                  {errors.region && (
                    <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                      <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errors.region}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="label">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Ex: Tunis"
                  required
                  className={`input ${errors.ville ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                />
                {errors.ville && (
                  <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                    <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.ville}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="Ex: Avenue Habib Bourguiba"
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
                  placeholder="Ex: 500000"
                  min="0"
                  step="1000"
                  required
                  className={`input ${errors.prix_demande ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                />
                {errors.prix_demande && (
                  <div className="mt-2 p-3 rounded-lg bg-danger-50 border-l-4 border-danger-500">
                    <p className="text-sm font-medium text-danger-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.prix_demande}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Chiffre d'affaires (TND)</label>
                  <input
                    type="number"
                    name="chiffre_affaires"
                    value={formData.chiffre_affaires}
                    onChange={handleChange}
                    placeholder="Ex: 200000"
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
                    placeholder="Ex: 50000"
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
                    placeholder="Ex: 10"
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
                    placeholder="Ex: 2015"
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

          {/* SECTION MÉDIAS - LOGO */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              Logo de l'entreprise (optionnel)
            </h2>
            <p className="text-sm text-gray-500 mb-4">Ajoutez le logo principal de votre entreprise</p>

            <div>
              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />

              {!logoPreview ? (
                <label
                  htmlFor="logoInput"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-primary-600">Cliquez pour ajouter un logo</span>
                    <span className="text-xs text-gray-400">PNG, JPG (max 5 MB)</span>
                  </div>
                </label>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <img src={logoPreview} alt="Logo" className="h-24 w-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    className="btn-danger inline-flex items-center gap-2"
                    onClick={handleRemoveLogo}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION MÉDIAS - PHOTOS */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Photos de l'entreprise (optionnel)
            </h2>
            <p className="text-sm text-gray-500 mb-4">Ajoutez jusqu'à 10 photos supplémentaires</p>

            <div>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <label
                htmlFor="imageInput"
                className="btn-secondary w-full inline-flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Choisir des images (max 10)
              </label>

              {/* Aperçus des images sélectionnées */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Aperçu ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 h-7 w-7 inline-flex items-center justify-center rounded-full bg-danger-500 text-white hover:bg-danger-600 transition-colors shadow"
                        onClick={() => handleRemoveImage(index)}
                        aria-label="Supprimer l'image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-sm text-gray-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {selectedImages.length}/10 images sélectionnées
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" />
                </svg>
                Publication en cours...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Publier l'entreprise
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublierEntreprise;
