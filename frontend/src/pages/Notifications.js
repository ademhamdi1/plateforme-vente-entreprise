import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Marquer comme lue si non lue
      if (!notification.est_lue) {
        await notificationService.marquerCommeLue(notification.id);
        // Mettre à jour localement
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, est_lue: true } : n
          )
        );
      }
      
      // Naviguer vers le lien si présent
      if (notification.lien) {
        navigate(notification.lien);
      }
    } catch (err) {
      console.error('Erreur marquage notification:', err);
    }
  };

  const handleMarquerToutLu = async () => {
    try {
      await notificationService.marquerToutCommeLu();
      setNotifications(prev => 
        prev.map(n => ({ ...n, est_lue: true }))
      );
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors du marquage');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'entreprise_validee': '✅',
      'entreprise_refusee': '❌',
      'nouveau_message': '💬',
      'nouveau_contact': '📧',
      'entreprise_favori': '⭐',
      'abonnement_expire': '⚠️',
      'system': '🔔'
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.est_lue;
    if (filter === 'read') return n.est_lue;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.est_lue).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-loading">
            <div className="spinner"></div>
            <p>Chargement des notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <h1>🔔 Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Actions */}
        <div className="notifications-actions">
          <div className="notifications-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes ({notifications.length})
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </button>
            <button
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Lues ({notifications.length - unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={handleMarquerToutLu}>
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="empty-icon">🔔</div>
            <h3>Aucune notification</h3>
            <p>
              {filter === 'unread' && 'Vous n\'avez aucune notification non lue.'}
              {filter === 'read' && 'Vous n\'avez aucune notification lue.'}
              {filter === 'all' && 'Vous recevrez ici toutes vos notifications importantes.'}
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.est_lue ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header-item">
                    <h4>{notification.titre}</h4>
                    {!notification.est_lue && <span className="unread-dot"></span>}
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-footer">
                    <span className="notification-time">{formatDate(notification.created_at)}</span>
                    <span className="notification-type">{notification.type_display}</span>
                  </div>
                </div>

                {notification.lien && (
                  <div className="notification-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
