import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import entrepriseService from '../../services/entreprise.service';
import authService from '../../services/auth.service';
import { toast } from 'react-toastify';
import './ContactRequests.css';

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (currentUser?.user_type !== 'vendeur') {
      toast.error('Accès réservé aux vendeurs');
      navigate('/dashboard');
      return;
    }

    loadContactRequests();
  }, [navigate, currentUser]);

  const loadContactRequests = async () => {
    try {
      setLoading(true);
      const response = await entrepriseService.getContactRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { label: 'En attente', class: 'status-pending' },
      'acceptee': { label: 'Acceptée', class: 'status-accepted' },
      'refusee': { label: 'Refusée', class: 'status-rejected' }
    };
    const badge = badges[statut] || badges['en_attente'];
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="contact-requests-page">
        <div className="loading">Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div className="contact-requests-page">
      <div className="requests-container">
        <div className="requests-header">
          <h1>Demandes de Contact</h1>
          <p>{requests.length} demande(s) reçue(s)</p>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <p>Aucune demande de contact pour le moment</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.nom}</h3>
                    {getStatusBadge(request.statut)}
                  </div>
                  <span className="request-date">
                    {new Date(request.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="request-info">
                  <div className="info-row">
                    <span className="info-label">📧 Email:</span>
                    <a href={`mailto:${request.email}`}>{request.email}</a>
                  </div>
                  {request.telephone && (
                    <div className="info-row">
                      <span className="info-label">📞 Téléphone:</span>
                      <a href={`tel:${request.telephone}`}>{request.telephone}</a>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">🏢 Entreprise:</span>
                    <span>{request.entreprise?.nom || 'N/A'}</span>
                  </div>
                </div>

                {request.message && (
                  <div className="request-message">
                    <strong>Message:</strong>
                    <p>{request.message}</p>
                  </div>
                )}

                {request.acheteur && (
                  <div className="request-buyer">
                    <span className="info-label">Acheteur:</span>
                    <span>{request.acheteur.username} ({request.acheteur.email})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactRequests;
