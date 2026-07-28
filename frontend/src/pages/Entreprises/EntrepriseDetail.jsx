import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EntrepriseService from '../../services/entreprise.service';
import AuthService from '../../services/auth.service';
import './Entreprise.css';

const EntrepriseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    fetchEntreprise();
  }, [slug]);

  const fetchEntreprise = async () => {
    try {
      const data = await EntrepriseService.getBySlug(slug);
      setEntreprise(data);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'entreprise');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    // Vérifier si l'utilisateur est connecté
    if (!AuthService.isAuthenticated()) {
      toast.info('Veuillez vous connecter pour contacter le vendeur');
      navigate('/login');
      return;
    }

    // Ouvrir le modal de contact
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }

    try {
      // Envoyer le message via l'API de messaging
      // Pour l'instant, on simule avec un toast
      toast.success('Message envoyé au vendeur avec succès!');
      setShowContactModal(false);
      setContactMessage('');
      // TODO: Implémenter l'envoi réel via l'API messaging
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!entreprise) {
    return <div className="error">Entreprise non trouvée</div>;
  }

  return (
    <div className="entreprise-detail-page">
      <div className="container">
        <div className="entreprise-header">
          <h1>{entreprise.nom}</h1>
          <div className="entreprise-meta">
            <span className="location">
              {entreprise.region} - {entreprise.ville}
            </span>
          </div>
        </div>

        <div className="entreprise-content">
          {/* Images */}
          {entreprise.images && entreprise.images.length > 0 && (
            <div className="entreprise-images">
              {entreprise.images.map((image, index) => (
                <img
                  key={index}
                  src={image.image}
                  alt={image.caption || entreprise.nom}
                />
              ))}
            </div>
          )}

          {/* Main Info */}
          <div className="info-section">
            <h2>À propos</h2>
            <p>{entreprise.description}</p>
          </div>

          {/* Financial Info */}
          <div className="info-section">
            <h2>Informations financières</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Prix demandé</strong>
                <span className="price">{entreprise.prix_demande} TND</span>
              </div>
              {entreprise.chiffre_affaires && (
                <div className="info-item">
                  <strong>Chiffre d'affaires</strong>
                  <span>{entreprise.chiffre_affaires} TND</span>
                </div>
              )}
              {entreprise.resultat_net && (
                <div className="info-item">
                  <strong>Résultat net</strong>
                  <span>{entreprise.resultat_net} TND</span>
                </div>
              )}
            </div>
          </div>

          {/* Operational Info */}
          <div className="info-section">
            <h2>Informations opérationnelles</h2>
            <div className="info-grid">
              {entreprise.nombre_employes && (
                <div className="info-item">
                  <strong>Employés</strong>
                  <span>{entreprise.nombre_employes}</span>
                </div>
              )}
              {entreprise.annee_creation && (
                <div className="info-item">
                  <strong>Année de création</strong>
                  <span>{entreprise.annee_creation}</span>
                </div>
              )}
              {entreprise.surface_local && (
                <div className="info-item">
                  <strong>Surface</strong>
                  <span>{entreprise.surface_local} m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Points forts */}
          {entreprise.points_forts && (
            <div className="info-section">
              <h2>Points forts</h2>
              <p>{entreprise.points_forts}</p>
            </div>
          )}

          {/* Contact */}
          <div className="contact-section">
            <h2>Intéressé par cette entreprise ?</h2>
            <button 
              className="btn btn-primary btn-large"
              onClick={handleContact}
            >
              Contacter le vendeur
            </button>
          </div>
        </div>

        {/* Modal de contact */}
        {showContactModal && (
          <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Contacter le vendeur</h3>
              <p>Entreprise: <strong>{entreprise.nom}</strong></p>
              <textarea
                placeholder="Écrivez votre message ici..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows="6"
                className="contact-textarea"
              />
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepriseDetail;
