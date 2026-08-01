import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import { authService } from '../services/authService';
import './ConversationDetail.css';

function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Charger la conversation depuis PostgreSQL
    loadConversation();
    
    // Récupérer le profil utilisateur
    loadUserProfile();
  }, [id, navigate]);

  useEffect(() => {
    // Scroll vers le bas quand les messages changent
    scrollToBottom();
  }, [messages]);

  const loadUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setCurrentUsername(profile.username);
    } catch (err) {
      console.error('Erreur profil:', err);
    }
  };

  const loadConversation = async () => {
    try {
      setLoading(true);
      // Charger depuis PostgreSQL
      const data = await messagingService.getConversation(id);
      setConversation(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Erreur chargement conversation:', err);
      setError('Impossible de charger la conversation');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      // Envoyer le message - sauvegardé dans PostgreSQL
      const sentMessage = await messagingService.sendMessage(id, newMessage.trim());
      
      // Ajouter le message à la liste
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      setError('');
    } catch (err) {
      console.error('Erreur envoi message:', err);
      setError('Impossible d\'envoyer le message');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="conversation-page">
        <div className="loading">Chargement de la conversation...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="conversation-page">
        <div className="error">Conversation introuvable</div>
      </div>
    );
  }

  const otherUser = conversation.acheteur.username === currentUsername 
    ? conversation.vendeur 
    : conversation.acheteur;

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="conversation-page">
      {/* Header */}
      <div className="conversation-header">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/messages')}>
            ← Retour
          </button>
          <div className="conversation-info">
            <h2>{otherUser.username}</h2>
            <p className="entreprise-name">{conversation.entreprise_nom}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <div className="container">
          {error && <div className="error">{error}</div>}

          {Object.keys(groupedMessages).map((date) => (
            <div key={date} className="messages-group">
              <div className="date-divider">
                <span>{date}</span>
              </div>

              {groupedMessages[date].map((message) => {
                const isOwn = message.sender_username === currentUsername;
                return (
                  <div
                    key={message.id}
                    className={`message-bubble ${isOwn ? 'own' : 'other'}`}
                  >
                    {!isOwn && (
                      <div className="message-sender">{message.sender_username}</div>
                    )}
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">{formatMessageTime(message.created_at)}</div>
                  </div>
                );
              })}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="message-input-container">
        <div className="container">
          <form onSubmit={handleSendMessage} className="message-form">
            <textarea
              className="message-input"
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              rows="1"
              disabled={sending}
            />
            <button 
              type="submit" 
              className="btn-send"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? '...' : '➤'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConversationDetail;
