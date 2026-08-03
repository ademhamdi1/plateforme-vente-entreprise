import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import { authService } from '../services/authService';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement de la conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700">Conversation introuvable</p>
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            className="p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate('/messages')}
            aria-label="Retour"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
              {otherUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{otherUser.username}</h2>
              <p className="text-sm text-gray-500 truncate">{conversation.entreprise_nom}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-4xl mx-auto px-4">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {Object.keys(groupedMessages).map((date) => (
            <div key={date} className="mb-6">
              {/* Date divider */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                  {date}
                </span>
              </div>

              {groupedMessages[date].map((message) => {
                const isOwn = message.sender_username === currentUsername;
                return (
                  <div
                    key={message.id}
                    className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {!isOwn && (
                        <div className="text-xs font-semibold text-primary-600 mb-1">
                          {message.sender_username}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      <div className={`text-xs mt-1 text-right ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <textarea
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl text-base resize-none outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
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
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={!newMessage.trim() || sending}
              aria-label="Envoyer"
            >
              {sending ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConversationDetail;
