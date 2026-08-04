import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { authService } from '../services/authService';
import { messagingService } from '../services/messagingService';
import { favorisService } from '../services/favorisService';
import { mediaService } from '../services/mediaService';

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
      const data = await entrepriseService.getBySlug(slug);
      setEntreprise(data);
      try {
        const imagesData = await mediaService.getImages(slug);
        setImages(imagesData);
      } catch (err) { console.error('Erreur images:', err); }
      try {
        const documentsData = await mediaService.getDocuments(slug);
        setDocuments(documentsData);
      } catch (err) { console.error('Erreur documents:', err); }
    } catch (err) {
      console.error('Error fetching entreprise:', err);
      setError('Entreprise non trouvée');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const checkFavoriteStatus = useCallback(async () => {
    if (authService.isAuthenticated()) {
      const type = authService.getUserType();
      setUserType(type);
      if (type === 'acheteur') {
        try {
          const status = await favorisService.checkFavoriStatus(slug);
          setIsFavorite(status.is_favorite);
        } catch (err) { console.error('Erreur favori:', err); }
      }
    }
  }, [slug]);

  useEffect(() => {
    fetchEntreprise();
    checkFavoriteStatus();
  }, [fetchEntreprise, checkFavoriteStatus]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    const ut = authService.getUserType();
    if (ut !== 'acheteur') return;
    try {
      const conversation = await messagingService.createConversation(slug);
      if (contactMessage.trim()) {
        await messagingService.sendMessage(conversation.id, contactMessage.trim());
      }
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      console.error('Erreur contact:', err);
      alert(err.response?.data?.error || 'Impossible de contacter le vendeur.');
    }
  };

  const handleToggleFavorite = async () => {
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    if (userType !== 'acheteur') return;
    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await favorisService.removeFavori(slug);
        setIsFavorite(false);
      } else {
        await favorisService.addFavori(slug);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Erreur favori:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(price);
  };

  const getSecteurLabel = (value) => {
    const secteurs = {
      'industrie': 'Industrie', 'agriculture': 'Agriculture', 'services': 'Services',
      'commerce': 'Commerce', 'tourisme': 'Tourisme', 'transport': 'Transport',
      'sante': 'Santé', 'informatique': 'Informatique', 'education': 'Éducation',
      'btp': 'BTP', 'franchise': 'Franchise', 'startup': 'Startups', 'autre': 'Autres',
    };
    return secteurs[value] || value;
  };

  const getRegionLabel = (value) => value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  const getTransactionLabel = (value) => {
    const types = { 'vente_totale': 'Vente totale', 'vente_partielle': 'Vente partielle', 'recherche_associe': 'Recherche d\'associé', 'levee_fonds': 'Levée de fonds' };
    return types[value] || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !entreprise) {
    return (
      <div className="empty-state min-h-[50vh]">
        <p className="text-gray-500 mb-4 text-lg">{error || 'Entreprise non trouvée'}</p>
        <button onClick={() => navigate('/entreprises')} className="btn-primary">Retour à la liste</button>
      </div>
    );
  }

  const Section = ({ icon, title, children }) => (
    <div className="card mb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">{icon} {title}</h2>
      {children}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/entreprises')}
            className="inline-flex items-center gap-1 text-primary-100 hover:text-white text-sm mb-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            {entreprise.nom_masque ? 'Entreprise confidentielle' : entreprise.nom}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              {getSecteurLabel(entreprise.secteur)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold capitalize">
              {getTransactionLabel(entreprise.type_transaction)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Price card */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 mb-4 text-white">
              <p className="text-primary-100 text-sm mb-1">Prix demandé</p>
              <p className="text-3xl font-extrabold">{formatPrice(entreprise.prix_demande)}</p>
            </div>

            {/* Logo */}
            {images.find(img => img.is_logo) && (
              <div className="card mb-4 text-center">
                <img src={images.find(img => img.is_logo).image_url} alt="Logo" className="max-h-32 mx-auto rounded-xl" />
              </div>
            )}

            {/* Photos */}
            {images.filter(img => !img.is_logo).length > 0 && (
              <Section icon="🖼️" title={`Photos (${images.filter(img => !img.is_logo).length})`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.filter(img => !img.is_logo).map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200 aspect-video"
                    >
                      <img src={image.image_url} alt={image.legende || 'Photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Description */}
            <Section icon="📋" title="Description">
              <p className="text-gray-700 leading-relaxed">{entreprise.description}</p>
            </Section>

            {/* Financial info */}
            {(entreprise.chiffre_affaires || entreprise.resultat_net || entreprise.valeur_actifs || entreprise.endettement) && (
              <Section icon="💰" title="Informations financières">
                <div className="grid grid-cols-2 gap-3">
                  {entreprise.chiffre_affaires && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Chiffre d'affaires</p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(entreprise.chiffre_affaires)}</p>
                    </div>
                  )}
                  {entreprise.resultat_net && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Résultat net</p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(entreprise.resultat_net)}</p>
                    </div>
                  )}
                  {entreprise.valeur_actifs && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Valeur des actifs</p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(entreprise.valeur_actifs)}</p>
                    </div>
                  )}
                  {entreprise.endettement && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Endettement</p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(entreprise.endettement)}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Operations */}
            {(entreprise.nombre_employes !== null || entreprise.annee_creation || entreprise.surface_local || entreprise.equipements_inclus) && (
              <Section icon="🏢" title="Informations opérationnelles">
                <div className="grid grid-cols-2 gap-3">
                  {entreprise.nombre_employes !== null && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Employés</p>
                      <p className="text-sm font-bold text-gray-900">{entreprise.nombre_employes}</p>
                    </div>
                  )}
                  {entreprise.annee_creation && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Créée en</p>
                      <p className="text-sm font-bold text-gray-900">{entreprise.annee_creation}</p>
                    </div>
                  )}
                  {entreprise.surface_local && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Surface</p>
                      <p className="text-sm font-bold text-gray-900">{entreprise.surface_local} m²</p>
                    </div>
                  )}
                  {entreprise.equipements_inclus && (
                    <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                      <p className="text-xs text-gray-500">Équipements inclus</p>
                      <p className="text-sm font-bold text-gray-900">{entreprise.equipements_inclus}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Additional info sections */}
            {entreprise.historique && (
              <Section icon="📜" title="Historique">
                <p className="text-gray-700 leading-relaxed">{entreprise.historique}</p>
              </Section>
            )}
            {entreprise.points_forts && (
              <Section icon="⭐" title="Points forts">
                <p className="text-gray-700 leading-relaxed">{entreprise.points_forts}</p>
              </Section>
            )}
            {entreprise.opportunites_developpement && (
              <Section icon="🚀" title="Opportunités de développement">
                <p className="text-gray-700 leading-relaxed">{entreprise.opportunites_developpement}</p>
              </Section>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <Section icon="📄" title={`Documents (${documents.length})`}>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <svg className="w-8 h-8 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{doc.nom}</p>
                        {doc.description && <p className="text-xs text-gray-500 truncate">{doc.description}</p>}
                      </div>
                      <a href={doc.document_url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-primary-50 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors">
                        Télécharger
                      </a>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Location */}
            <div className="card">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localisation
              </h3>
              <p className="text-gray-900 font-semibold">{getRegionLabel(entreprise.region)}</p>
              {!entreprise.adresse_masquee && entreprise.ville && (
                <p className="text-gray-500 text-sm">{entreprise.ville}</p>
              )}
              {entreprise.adresse_masquee && (
                <p className="text-gray-400 text-sm italic mt-1">Adresse masquée</p>
              )}
            </div>

            {/* Stats */}
            <div className="card">
              <h3 className="text-base font-bold text-gray-900 mb-3">Statistiques</h3>
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{entreprise.nombre_vues}</p>
                  <p className="text-xs text-gray-500">vues</p>
                </div>
              </div>
            </div>

            {/* Favorite */}
            {userType === 'acheteur' && (
              <div className="card">
                <h3 className="text-base font-bold text-gray-900 mb-3">Favoris</h3>
                <button
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 ${
                    isFavorite ? 'bg-danger-50 text-danger-600 border-2 border-danger-500' : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-danger-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favoriteLoading ? '...' : isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
              </div>
            )}

            {/* Contact */}
            <div className="card">
              <h3 className="text-base font-bold text-gray-900 mb-3">Contacter le vendeur</h3>
              {!showContactForm ? (
                <button onClick={() => setShowContactForm(true)} className="btn-primary w-full">
                  Envoyer un message
                </button>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Votre message..."
                    rows="4"
                    required
                    className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1">Envoyer</button>
                    <button type="button" onClick={() => setShowContactForm(false)}
                      className="inline-flex items-center justify-center px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" onClick={() => setSelectedImage(null)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-full">
            <img src={selectedImage.image_url} alt={selectedImage.legende} className="max-w-full max-h-[80vh] rounded-xl" />
            {selectedImage.legende && (
              <p className="text-white text-center mt-3">{selectedImage.legende}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailEntreprise;
