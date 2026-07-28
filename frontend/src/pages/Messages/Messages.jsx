import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import entrepriseService from '../../services/entreprise.service';
import authService from '../../services/auth.service';
import { toast } from 'react-toastify';
import './Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadConversations();
  }, [navigate]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await entrepriseService.getConversations();
      // Ensure we always have an array
      const conversationsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
      setConversations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await entrepriseService.getMessages(conversationId);
      // Ensure we always have an array
      const messagesData = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);
      setMessages(messagesData);
      setSelectedConversation(conversationId);
      
      // Marquer les messages comme lus
      await entrepriseService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
      setMessages([]); // Set empty array on error
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    try {
      setSendingMessage(true);
      await entrepriseService.sendMessage(selectedConversation, {
        content: newMessage
      });
      
      setNewMessage('');
      loadMessages(selectedConversation);
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherUser = (conversation) => {
    if (!currentUser) return '';
    
    if (currentUser.user_type === 'acheteur') {
      return conversation.vendeur?.username || 'Vendeur';
    } else {
      return conversation.acheteur?.username || 'Acheteur';
    }
  };

  if (loading) {
    return (
      <div className="messages-page">
        <div className="loading">Chargement des conversations...</div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="conversations-sidebar">
          <h2>Conversations</h2>
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>Aucune conversation</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation === conversation.id ? 'active' : ''
                  }`}
                  onClick={() => loadMessages(conversation.id)}
                >
                  <div className="conversation-header">
                    <h4>{getOtherUser(conversation)}</h4>
                    {conversation.unread_count > 0 && (
                      <span className="unread-badge">{conversation.unread_count}</span>
                    )}
                  </div>
                  <p className="conversation-subject">{conversation.sujet}</p>
                  <p className="conversation-entreprise">
                    {conversation.entreprise?.nom || 'Entreprise'}
                  </p>
                  <small className="conversation-date">
                    {new Date(conversation.updated_at).toLocaleDateString('fr-FR')}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-main">
          {!selectedConversation ? (
            <div className="no-conversation-selected">
              <p>Sélectionnez une conversation pour voir les messages</p>
            </div>
          ) : (
            <>
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>Aucun message dans cette conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.sender?.id === currentUser?.id ? 'sent' : 'received'
                      }`}
                    >
                      <div className="message-header">
                        <span className="message-sender">
                          {message.sender?.username || 'Utilisateur'}
                        </span>
                        <span className="message-date">
                          {new Date(message.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="message-content">{message.content}</div>
                      {message.attachment && (
                        <div className="message-attachment">
                          <a href={message.attachment} target="_blank" rel="noopener noreferrer">
                            📎 Pièce jointe
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form className="message-form" onSubmit={handleSendMessage}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  rows="3"
                  disabled={sendingMessage}
                />
                <button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                  {sendingMessage ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
