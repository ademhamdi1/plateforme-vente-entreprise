import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import { authService } from '../services/authService';
import './Messages.css';

function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Récupérer le type d'utilisateur
    const type = authService.getUserType();
    setUserType(type);

    // Charger les conversations depuis PostgreSQL
    loadConversations();
  }, [navigate]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // Charger depuis PostgreSQL
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      setError('Impossible de charger les conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="messages-page">
        <div className="container">
          <div className="loading">Chargement des conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="container">
        <div className="messages-header">
          <h1>📬 Messages</h1>
          <p className="subtitle">Vos conversations</p>
        </div>

        {error && <div className="error">{error}</div>}

        {conversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Aucune conversation</h3>
            <p>
              {userType === 'acheteur' 
                ? 'Contactez un vendeur depuis la page d\'une entreprise pour démarrer une conversation.'
                : 'Les acheteurs intéressés pourront vous contacter via vos annonces.'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/entreprises')}
            >
              Voir les entreprises
            </button>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-card ${conv.unread_count > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationClick(conv.id)}
              >
                <div className="conversation-header">
                  <div className="conversation-info">
                    <h3 className="conversation-title">
                      {userType === 'acheteur' ? conv.vendeur_username : conv.acheteur_username}
                    </h3>
                    <p className="conversation-entreprise">{conv.entreprise_nom}</p>
                  </div>
                  <div className="conversation-meta">
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>

                {conv.last_message && (
                  <div className="last-message">
                    <p className="message-content">
                      {conv.last_message.sender_username === conv.acheteur_username && userType === 'acheteur' ? 'Vous' : conv.last_message.sender_username}: {conv.last_message.content}
                    </p>
                    <span className="message-time">
                      {formatDate(conv.last_message.created_at)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
