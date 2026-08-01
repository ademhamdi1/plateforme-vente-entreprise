import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';
import { messagingService } from '../services/messagingService';
import { favorisService } from '../services/favorisService';
import { mediaService } from '../services/mediaService';
import './DetailEntreprise.css';

function DetailEntreprise() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = useState(null);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [userType, setUserType] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchEntreprise = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch from PostgreSQL + increment views
      const data = await entrepriseService.getBySlug(slug);
      setEntreprise(data);
      
      // Charger les images depuis PostgreSQL
      try {
        const imagesData = await mediaService.getImages(slug);
        setImages(imagesData);
      } catch (err) {
        console.error('Erreur chargement images:', err);
      }
      
      // Charger les documents depuis PostgreSQL
      try {
        const documentsData = await mediaService.getDocuments(slug);
        setDocuments(documentsData);
      } catch (err) {
        console.error('Erreur chargement documents:', err);
      }
      
    } catch (err) {
      console.error('Error fetching entreprise:', err);
      setError('Entreprise non trouvée');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const checkFavoriteStatus = useCallback(async () => {
    // Vérifier le statut favori seulement si l'utilisateur est connecté et acheteur
    if (authService.isAuthenticated()) {
      const type = authService.getUserType();
      setUserType(type);
      
      if (type === 'acheteur') {
        try {
          const status = await favorisService.checkFavoriStatus(slug);
          setIsFavorite(status.is_favorite);
        } catch (err) {
          console.error('Erreur vérification favori:', err);
        }
      }
    }
  }, [slug]);

  useEffect(() => {
    fetchEntreprise();
    checkFavoriteStatus();
  }, [fetchEntreprise, checkFavoriteStatus]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier que l'utilisateur est acheteur
    const userType = authService.getUserType();
    if (userType !== 'acheteur') {
      alert('❌ Seuls les acheteurs peuvent contacter les vendeurs.');
      return;
    }

    try {
      // Créer ou récupérer la conversation dans PostgreSQL
      const conversation = await messagingService.createConversation(slug);
      
      // Si on a un message, l'envoyer immédiatement dans PostgreSQL
      if (contactMessage.trim()) {
        await messagingService.sendMessage(conversation.id, contactMessage.trim());
      }

      // Rediriger vers la conversation
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      console.error('Erreur contact vendeur:', err);
      if (err.response?.data?.error) {
        alert(`❌ ${err.response.data.error}`);
      } else {
        alert('❌ Impossible de contacter le vendeur. Veuillez réessayer.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier que l'utilisateur est acheteur
    if (userType !== 'acheteur') {
      alert('❌ Seuls les acheteurs peuvent ajouter des favoris.');
      return;
    }

    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Retirer des favoris - supprimé de PostgreSQL
        await favorisService.removeFavori(slug);
        setIsFavorite(false);
      } else {
        // Ajouter aux favoris - sauvegardé dans PostgreSQL
        await favorisService.addFavori(slug);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Erreur toggle favori:', err);
      if (err.response?.data?.error) {
        alert(`❌ ${err.response.data.error}`);
      } else {
        alert('❌ Impossible de modifier les favoris.');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSecteurLabel = (value) => {
    const secteurs = {
      'industrie': 'Industrie',
      'agriculture': 'Agriculture',
      'services': 'Services',
      'commerce': 'Commerce',
      'tourisme': 'Tourisme et hôtellerie',
      'transport': 'Transport et logistique',
      'sante': 'Santé',
      'informatique': 'Technologies de l\'information',
      'education': 'Éducation',
      'btp': 'BTP et construction',
      'franchise': 'Franchise',
      'startup': 'Startups',
      'autre': 'Autres',
    };
    return secteurs[value] || value;
  };

  const getRegionLabel = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTransactionLabel = (value) => {
    const types = {
      'vente_totale': 'Vente totale',
      'vente_partielle': 'Vente partielle',
      'recherche_associe': 'Recherche d\'associé',
      'levee_fonds': 'Levée de fonds',
    };
    return types[value] || value;
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="loading">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !entreprise) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="error-page">
            <h2>😔 {error || 'Entreprise non trouvée'}</h2>
            <button className="btn btn-primary" onClick={() => navigate('/entreprises')}>
              ← Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <button className="btn-back" onClick={() => navigate('/entreprises')}>
            ← Retour
          </button>
          <h1>
            {entreprise.nom_masque ? '🔒 Entreprise confidentielle' : entreprise.nom}
          </h1>
          <div className="header-badges">
            <span className="badge badge-primary">{getSecteurLabel(entreprise.secteur)}</span>
            <span className="badge badge-secondary">{getTransactionLabel(entreprise.type_transaction)}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="detail-grid">
          {/* Left Column - Main Info */}
          <div className="detail-main">
            {/* Logo si disponible */}
            {images.find(img => img.is_logo) && (
              <div className="logo-section">
                <img 
                  src={images.find(img => img.is_logo).image_url} 
                  alt="Logo entreprise" 
                  className="entreprise-logo"
                />
              </div>
            )}

            {/* Prix */}
            <div className="price-card">
              <div className="price-label">Prix demandé</div>
              <div className="price-value">{formatPrice(entreprise.prix_demande)}</div>
            </div>

            {/* Galerie d'images */}
            {images.length > 0 && (
              <div className="info-section">
                <h2>🖼️ Photos ({images.length})</h2>
                <div className="images-gallery">
                  {images.map((image) => (
                    <div 
                      key={image.id} 
                      className="gallery-image"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image.image_url} alt={image.legende || 'Photo entreprise'} />
                      {image.legende && (
                        <div className="image-caption">{image.legende}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="info-section">
              <h2>📋 Description</h2>
              <p className="description-text">{entreprise.description}</p>
            </div>

            {/* Informations financières */}
            {(entreprise.chiffre_affaires || entreprise.resultat_net || entreprise.valeur_actifs || entreprise.endettement) && (
              <div className="info-section">
                <h2>💰 Informations financières</h2>
                <div className="info-grid">
                  {entreprise.chiffre_affaires && (
                    <div className="info-item">
                      <span className="info-label">Chiffre d'affaires</span>
                      <span className="info-value">{formatPrice(entreprise.chiffre_affaires)}</span>
                    </div>
                  )}
                  {entreprise.resultat_net && (
                    <div className="info-item">
                      <span className="info-label">Résultat net</span>
                      <span className="info-value">{formatPrice(entreprise.resultat_net)}</span>
                    </div>
                  )}
                  {entreprise.valeur_actifs && (
                    <div className="info-item">
                      <span className="info-label">Valeur des actifs</span>
                      <span className="info-value">{formatPrice(entreprise.valeur_actifs)}</span>
                    </div>
                  )}
                  {entreprise.endettement && (
                    <div className="info-item">
                      <span className="info-label">Endettement</span>
                      <span className="info-value">{formatPrice(entreprise.endettement)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informations opérationnelles */}
            {(entreprise.nombre_employes !== null || entreprise.annee_creation || entreprise.surface_local || entreprise.equipements_inclus) && (
              <div className="info-section">
                <h2>🏢 Informations opérationnelles</h2>
                <div className="info-grid">
                  {entreprise.nombre_employes !== null && (
                    <div className="info-item">
                      <span className="info-label">Nombre d'employés</span>
                      <span className="info-value">{entreprise.nombre_employes}</span>
                    </div>
                  )}
                  {entreprise.annee_creation && (
                    <div className="info-item">
                      <span className="info-label">Année de création</span>
                      <span className="info-value">{entreprise.annee_creation}</span>
                    </div>
                  )}
                  {entreprise.surface_local && (
                    <div className="info-item">
                      <span className="info-label">Surface du local</span>
                      <span className="info-value">{entreprise.surface_local} m²</span>
                    </div>
                  )}
                  {entreprise.equipements_inclus && (
                    <div className="info-item full-width">
                      <span className="info-label">Équipements inclus</span>
                      <span className="info-value">{entreprise.equipements_inclus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Historique */}
            {entreprise.historique && (
              <div className="info-section">
                <h2>📜 Historique</h2>
                <p className="description-text">{entreprise.historique}</p>
              </div>
            )}

            {/* Points forts */}
            {entreprise.points_forts && (
              <div className="info-section">
                <h2>⭐ Points forts</h2>
                <p className="description-text">{entreprise.points_forts}</p>
              </div>
            )}

            {/* Opportunités de développement */}
            {entreprise.opportunites_developpement && (
              <div className="info-section">
                <h2>🚀 Opportunités de développement</h2>
                <p className="description-text">{entreprise.opportunites_developpement}</p>
              </div>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <div className="info-section">
                <h2>📄 Documents ({documents.length})</h2>
                <div className="documents-grid">
                  {documents.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <div className="document-icon">📄</div>
                      <div className="document-details">
                        <h4>{doc.nom}</h4>
                        {doc.description && <p>{doc.description}</p>}
                        <span className="doc-size">{doc.file_size} KB</span>
                      </div>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-small"
                      >
                        📥 Télécharger
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vidéo */}
            {entreprise.video_url && (
              <div className="info-section">
                <h2>🎥 Vidéo de présentation</h2>
                <a 
                  href={entreprise.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Voir la vidéo
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="detail-sidebar">
            {/* Localisation */}
            <div className="sidebar-card">
              <h3>📍 Localisation</h3>
              <div className="location-info">
                <p className="region">{getRegionLabel(entreprise.region)}</p>
                {!entreprise.adresse_masquee && (
                  <p className="city">{entreprise.ville}</p>
                )}
                {entreprise.adresse_masquee && (
                  <p className="masked">🔒 Adresse masquée</p>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="sidebar-card">
              <h3>📊 Statistiques</h3>
              <div className="stats-info">
                <div className="stat-item">
                  <span className="stat-icon">👁️</span>
                  <span className="stat-value">{entreprise.nombre_vues}</span>
                  <span className="stat-label">vues</span>
                </div>
              </div>
            </div>

            {/* Favoris - Acheteurs seulement */}
            {userType === 'acheteur' && (
              <div className="sidebar-card">
                <h3>⭐ Favoris</h3>
                <button
                  className={`btn btn-block ${isFavorite ? 'btn-favorite-active' : 'btn-favorite'}`}
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? '...' : isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
                </button>
              </div>
            )}

            {/* Contact vendeur */}
            <div className="sidebar-card contact-card">
              <h3>📧 Contacter le vendeur</h3>
              {!showContactForm ? (
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => setShowContactForm(true)}
                >
                  Envoyer un message
                </button>
              ) : (
                <form onSubmit={handleContactSubmit} className="contact-form">
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Votre message..."
                    rows="5"
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Envoyer
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowContactForm(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage.image_url} alt={selectedImage.legende} />
            {selectedImage.legende && (
              <div className="modal-caption">{selectedImage.legende}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailEntreprise;
