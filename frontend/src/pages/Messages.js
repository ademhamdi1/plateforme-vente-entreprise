import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import { authService } from '../services/authService';

function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    const type = authService.getUserType();
    setUserType(type);
    loadConversations();
  }, [navigate]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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

  return (
    <div>
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <h1>Messages</h1>
          <p>Vos conversations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">
            {error}
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="empty-state min-h-[40vh]">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune conversation</h3>
            <p className="text-gray-500 text-sm mb-4 text-center max-w-md">
              {userType === 'acheteur'
                ? "Contactez un vendeur depuis la page d'une entreprise pour démarrer une conversation."
                : 'Les acheteurs intéressés pourront vous contacter via vos annonces.'}
            </p>
            <button onClick={() => navigate('/entreprises')} className="btn-primary">Voir les entreprises</button>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-card active:scale-[0.99] ${
                  conv.unread_count > 0 ? 'border-primary-300 shadow-soft' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {userType === 'acheteur' ? conv.vendeur_username : conv.acheteur_username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{conv.entreprise_nom}</p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-primary-500 rounded-full shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                {conv.last_message && (
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      <span className="font-medium">
                        {conv.last_message.sender_username === conv.acheteur_username && userType === 'acheteur' ? 'Vous' : conv.last_message.sender_username}:
                      </span>{' '}
                      {conv.last_message.content}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">{formatDate(conv.last_message.created_at)}</span>
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
