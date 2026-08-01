import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';
import './GestionMedias.css';

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
      alert('❌ Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ L\'image ne doit pas dépasser 5 MB');
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
      alert(err.response?.data?.error || '❌ Impossible d\'uploader l\'image');
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
      alert('❌ Impossible de supprimer l\'image');
    }
  };

  // === GESTION DOCUMENTS ===
  
  const handleDocumentSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (!file.name.endsWith('.pdf')) {
      alert('❌ Seuls les fichiers PDF sont acceptés');
      return;
    }

    // Vérifier la taille (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Le document ne doit pas dépasser 10 MB');
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
      alert(err.response?.data?.error || '❌ Impossible d\'uploader le document');
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
      alert('❌ Impossible de supprimer le document');
    }
  };

  if (loading) {
    return (
      <div className="medias-page">
        <div className="container">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!entreprise) {
    return (
      <div className="medias-page">
        <div className="container">
          <div className="error">Entreprise non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="medias-page">
      <div className="container">
        <div className="medias-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Retour
          </button>
          <h1>📸 Gérer les médias</h1>
          <p className="subtitle">{entreprise.nom}</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* SECTION IMAGES */}
        <div className="media-section">
          <h2>🖼️ Photos ({images.length}/10)</h2>
          
          {/* Upload Form */}
          <div className="upload-card">
            <h3>Ajouter une photo</h3>
            
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="imageInput" className="btn btn-secondary btn-block">
              📁 Choisir une image
            </label>

            {imagePreview && (
              <div className="preview-section">
                <img src={imagePreview} alt="Aperçu" className="image-preview" />
                
                <div className="form-group">
                  <label>Légende (optionnel)</label>
                  <input
                    type="text"
                    value={imageLegende}
                    onChange={(e) => setImageLegende(e.target.value)}
                    placeholder="Description de l'image"
                  />
                </div>

                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadImage}
                    disabled={uploadingImage || images.length >= 10}
                  >
                    {uploadingImage ? 'Upload...' : '✓ Uploader'}
                  </button>
                  <button
                    className="btn btn-secondary"
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
            <div className="images-grid">
              {images.map((image) => (
                <div key={image.id} className="image-card">
                  <img src={image.image_url} alt={image.legende} />
                  {image.legende && (
                    <p className="image-caption">{image.legende}</p>
                  )}
                  <button
                    className="btn-delete-media"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucune photo ajoutée</p>
          )}
        </div>

        {/* SECTION DOCUMENTS */}
        <div className="media-section">
          <h2>📄 Documents PDF ({documents.length}/5)</h2>
          
          {/* Upload Form */}
          <div className="upload-card">
            <h3>Ajouter un document</h3>
            
            <input
              type="file"
              id="documentInput"
              accept=".pdf"
              onChange={handleDocumentSelect}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="documentInput" className="btn btn-secondary btn-block">
              📁 Choisir un PDF
            </label>

            {selectedDocumentFile && (
              <div className="preview-section">
                <p className="file-name">📄 {selectedDocumentFile.name}</p>
                
                <div className="form-group">
                  <label>Nom du document</label>
                  <input
                    type="text"
                    value={documentNom}
                    onChange={(e) => setDocumentNom(e.target.value)}
                    placeholder="Ex: Bilan financier 2023"
                  />
                </div>

                <div className="form-group">
                  <label>Description (optionnel)</label>
                  <textarea
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="Description du document"
                    rows="3"
                  />
                </div>

                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadDocument}
                    disabled={uploadingDocument || documents.length >= 5}
                  >
                    {uploadingDocument ? 'Upload...' : '✓ Uploader'}
                  </button>
                  <button
                    className="btn btn-secondary"
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
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="document-icon">📄</div>
                  <div className="document-info">
                    <h4>{doc.nom}</h4>
                    {doc.description && <p>{doc.description}</p>}
                    <span className="document-size">{doc.file_size} KB</span>
                  </div>
                  <div className="document-actions">
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-small btn-secondary"
                    >
                      Voir
                    </a>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun document ajouté</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionMedias;
