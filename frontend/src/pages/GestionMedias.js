import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';

function GestionMedias() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [entreprise, setEntreprise] = useState(null);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageLegende, setImageLegende] = useState('');
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
  const [documentNom, setDocumentNom] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier que l'utilisateur est vendeur
    const userType = authService.getUserType();
    if (userType !== 'vendeur') {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [slug, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger l'entreprise depuis PostgreSQL
      const entrepriseData = await entrepriseService.getBySlug(slug);
      setEntreprise(entrepriseData);

      // Charger les images depuis PostgreSQL
      const imagesData = await mediaService.getImages(slug);
      setImages(imagesData);

      // Charger les documents depuis PostgreSQL
      const documentsData = await mediaService.getDocuments(slug);
      setDocuments(documentsData);

    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  // === GESTION IMAGES ===

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    setSelectedImageFile(file);

    // Créer un aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImageFile) return;

    try {
      setUploadingImage(true);

      // Upload vers PostgreSQL + /media/
      const newImage = await mediaService.uploadImage(
        slug,
        selectedImageFile,
        imageLegende
      );

      // Ajouter à la liste
      setImages([...images, newImage]);

      // Reset
      setSelectedImageFile(null);
      setImagePreview(null);
      setImageLegende('');
      document.getElementById('imageInput').value = '';

    } catch (err) {
      console.error('Erreur upload image:', err);
      alert(err.response?.data?.error || 'Impossible d\'uploader l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    try {
      // Supprimer de PostgreSQL + /media/
      await mediaService.deleteImage(slug, imageId);

      // Retirer de la liste
      setImages(images.filter(img => img.id !== imageId));

    } catch (err) {
      console.error('Erreur suppression image:', err);
      alert('Impossible de supprimer l\'image');
    }
  };

  // === GESTION DOCUMENTS ===

  const handleDocumentSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (!file.name.endsWith('.pdf')) {
      alert('Seuls les fichiers PDF sont acceptés');
      return;
    }

    // Vérifier la taille (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le document ne doit pas dépasser 10 MB');
      return;
    }

    setSelectedDocumentFile(file);
    setDocumentNom(file.name);
  };

  const handleUploadDocument = async () => {
    if (!selectedDocumentFile) return;

    try {
      setUploadingDocument(true);

      // Upload vers PostgreSQL + /media/
      const newDocument = await mediaService.uploadDocument(
        slug,
        selectedDocumentFile,
        documentNom,
        documentDescription
      );

      // Ajouter à la liste
      setDocuments([newDocument, ...documents]);

      // Reset
      setSelectedDocumentFile(null);
      setDocumentNom('');
      setDocumentDescription('');
      document.getElementById('documentInput').value = '';

    } catch (err) {
      console.error('Erreur upload document:', err);
      alert(err.response?.data?.error || 'Impossible d\'uploader le document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Supprimer ce document ?')) return;

    try {
      // Supprimer de PostgreSQL + /media/
      await mediaService.deleteDocument(slug, documentId);

      // Retirer de la liste
      setDocuments(documents.filter(doc => doc.id !== documentId));

    } catch (err) {
      console.error('Erreur suppression document:', err);
      alert('Impossible de supprimer le document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  if (!entreprise) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 my-4">
            Entreprise non trouvée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gérer les médias
          </h1>
          <p className="text-gray-600 mt-2">{entreprise.nom}</p>
        </div>

        {error && (
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 my-4">
            {error}
          </div>
        )}

        {/* SECTION IMAGES */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photos ({images.length}/10)
          </h2>

          {/* Upload Form */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une photo</h3>

            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            <label
              htmlFor="imageInput"
              className="btn-secondary w-full cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choisir une image
            </label>

            {imagePreview && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full max-h-80 object-contain rounded-lg border border-gray-200 mb-4"
                />

                <div className="mb-4">
                  <label className="label">Légende (optionnel)</label>
                  <input
                    type="text"
                    className="input"
                    value={imageLegende}
                    onChange={(e) => setImageLegende(e.target.value)}
                    placeholder="Description de l'image"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={handleUploadImage}
                    disabled={uploadingImage || images.length >= 10}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {uploadingImage ? 'Upload...' : 'Uploader'}
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    onClick={() => {
                      setSelectedImageFile(null);
                      setImagePreview(null);
                      setImageLegende('');
                    }}
                    disabled={uploadingImage}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden flex flex-col">
                  <img
                    src={image.image_url}
                    alt={image.legende}
                    className="w-full h-40 object-cover"
                  />
                  {image.legende && (
                    <p className="text-sm text-gray-700 px-3 pt-3">{image.legende}</p>
                  )}
                  <div className="p-3 mt-auto">
                    <button
                      className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-danger-50 text-danger-600 font-medium text-sm hover:bg-danger-100 transition-colors"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-gray-500">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Aucune photo ajoutée</p>
            </div>
          )}
        </div>

        {/* SECTION DOCUMENTS */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Documents PDF ({documents.length}/5)
          </h2>

          {/* Upload Form */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un document</h3>

            <input
              type="file"
              id="documentInput"
              accept=".pdf"
              onChange={handleDocumentSelect}
              style={{ display: 'none' }}
            />

            <label
              htmlFor="documentInput"
              className="btn-secondary w-full cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choisir un PDF
            </label>

            {selectedDocumentFile && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <svg className="w-5 h-5 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {selectedDocumentFile.name}
                </p>

                <div className="mb-4">
                  <label className="label">Nom du document</label>
                  <input
                    type="text"
                    className="input"
                    value={documentNom}
                    onChange={(e) => setDocumentNom(e.target.value)}
                    placeholder="Ex: Bilan financier 2023"
                  />
                </div>

                <div className="mb-4">
                  <label className="label">Description (optionnel)</label>
                  <textarea
                    className="input min-h-[80px] resize-y"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="Description du document"
                    rows="3"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={handleUploadDocument}
                    disabled={uploadingDocument || documents.length >= 5}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {uploadingDocument ? 'Upload...' : 'Uploader'}
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    onClick={() => {
                      setSelectedDocumentFile(null);
                      setDocumentNom('');
                      setDocumentDescription('');
                    }}
                    disabled={uploadingDocument}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Documents List */}
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl shadow-card border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-danger-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{doc.nom}</h4>
                    {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                    <span className="inline-block text-xs text-gray-500 mt-1">{doc.file_size} KB</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-white text-primary-600 border-2 border-primary-500 font-semibold text-sm hover:bg-primary-50 transition-all"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir
                    </a>
                    <button
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-danger-500 text-white font-semibold text-sm hover:bg-danger-600 transition-all"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-gray-500">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p>Aucun document ajouté</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionMedias;
